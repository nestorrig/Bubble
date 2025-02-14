export const ambientLight = /* glsl */ `
  vec3 ambientLight(vec3 lightColor, float lightIntesity)
  {
    return lightColor * lightIntesity;
  }
`;

export const directionalLight = /* glsl */ `
  vec3 directionalLight(vec3 lightColor, float lightIntesity, vec3 normal, vec3 lightPosition, vec3 viewDirection, float specularPower)
  {
    vec3 lightDirection = normalize(lightPosition);
    vec3 lightReflection = reflect(-lightDirection, normal);

    // shading
    float shading = dot(normal, lightDirection);
    shading = max(0.0, shading);

    // specular
    float specular = - dot(lightReflection, viewDirection);
    specular = max(0.0, specular);
    specular = pow(specular, specularPower);

    return lightColor * lightIntesity * (shading + specular);
  }
`;

export const pointLight = /* glsl */ `
  vec3 pointLight(vec3 lightColor, float lightIntesity, vec3 normal, vec3 lightPosition, vec3 viewDirection, float specularPower, vec3 position, float lightDecay)
  {
    vec3 lightDelta = lightPosition - position;
    float lightDistance = length(lightDelta);
    vec3 lightDirection = normalize(lightDelta);
    vec3 lightReflection = reflect(-lightDirection, normal);

    // shading
    float shading = dot(normal, lightDirection);
    shading = max(0.0, shading);

    // specular
    float specular = dot(lightReflection, viewDirection);
    specular = max(0.0, specular);
    specular = pow(specular, specularPower);

    // decay
    // float decay = 1.0 / (1.0 + lightDecay * pow(lightDistance, 2.0));
    float decay = 1.0 - lightDistance * lightDecay;
    decay = max(0.0, decay);

    return lightColor * lightIntesity * decay * (shading + specular);
  }
`;
