import * as THREE from 'three';

export const OrbVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uAudioLevel;
  uniform float uBass;
  uniform float uMid;
  uniform float uHigh;
  uniform float uDisplacement;
  uniform float uNoiseSpeed;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  varying float vDisplacementVal;

  //
  // Description : Array and textureless GLSL 2D/3D/4D simplex 
  //               noise functions.
  //      Author : Ian McEwan, Ashima Arts.
  //  Maintainer : iq
  //     Lastmod : 20110108 (stock)
  //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
  //               Distributed under the MIT License. See LICENSE file.
  //
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    // Permutations
    i = mod289(i);
    vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    // Gradients
    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z);  // mod(p,7*7)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);    // mod(j,N)

    vec4 x = x_ *ns.x + vec4(ns.yyyy);
    vec4 y = y_ *ns.x + vec4(ns.yyyy);
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    // Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;

    float t = uTime * uNoiseSpeed;

    // Multi-frequency noise calculation
    float lowFreqNoise = snoise(position * 1.2 + vec3(t * 0.4)) * (1.0 + uBass * 1.5);
    float midFreqNoise = snoise(position * 2.8 + vec3(t * 0.8)) * (0.5 + uMid * 1.2);
    float highFreqNoise = snoise(position * 5.0 + vec3(t * 1.5)) * (0.2 + uHigh * 1.0);

    float combinedNoise = lowFreqNoise * 0.5 + midFreqNoise * 0.35 + highFreqNoise * 0.15;
    
    float totalDisplacement = combinedNoise * (uDisplacement + uAudioLevel * 0.4);
    vDisplacementVal = totalDisplacement;

    vec3 newPosition = position + normal * totalDisplacement;
    vec4 worldPos = modelMatrix * vec4(newPosition, 1.0);
    vWorldPosition = worldPos.xyz;

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

export const OrbFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uAudioLevel;
  uniform float uIntensity;
  uniform vec3 uColorA;       // Electric Blue
  uniform vec3 uColorB;       // Cyan / Highlight
  uniform vec3 uColorCore;   // Deep Violet Core
  uniform vec3 uColorRim;    // White Rim
  uniform float uState;      // 0: idle, 1: listening, 2: thinking, 3: speaking

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  varying float vDisplacementVal;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);

    // Fresnel rim lighting math
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.8);

    // Internal volumetric energy pulse pattern
    float energyPulse = sin(vPosition.y * 4.0 + uTime * 2.5 + vDisplacementVal * 6.0) * 0.5 + 0.5;
    
    // Mix core gradient (Deep Violet -> Electric Blue -> Cyan)
    vec3 baseColor = mix(uColorCore, uColorA, energyPulse * 0.7 + 0.3);
    baseColor = mix(baseColor, uColorB, vDisplacementVal * 1.5 + uAudioLevel * 0.5);

    // State specific color modulations
    if (uState > 1.5 && uState < 2.5) {
      // Thinking state: Swirling cyan / violet pulse
      float swirl = sin(uTime * 4.0 + vPosition.x * 6.0) * 0.5 + 0.5;
      baseColor = mix(baseColor, vec3(0.0, 0.9, 1.0), swirl * 0.4);
    } else if (uState > 2.5) {
      // Speaking state: High energy plasma white/cyan boost
      baseColor += vec3(0.15, 0.25, 0.4) * (uAudioLevel + 0.3);
    }

    // Add Fresnel Rim Light
    vec3 finalColor = mix(baseColor, uColorRim, fresnel * 0.75);

    // Emissive intensity modulation
    float emissiveGlow = (0.75 + uAudioLevel * 0.65 + fresnel * 0.5) * uIntensity;

    gl_FragColor = vec4(finalColor * emissiveGlow, 0.92);
  }
`;
