// wgs84经纬度转大地坐标系
vec3 convertCoordinate(vec3 lonLatLev) {
    // WGS84 (lon, lat, lev) -> ECEF (x, y, z)
    // read https://en.wikipedia.org/wiki/Geographic_coordinate_conversion#From_geodetic_to_ECEF_coordinates for detail

    // WGS 84 geometric constants 
    float a = 6378137.0; // Semi-major axis 
    float b = 6356752.3142; // Semi-minor axis 
    float e2 = 6.69437999014e-3; // First eccentricity squared

    float latitude = radians(lonLatLev.y);
    float longitude = radians(lonLatLev.x);

    float cosLat = cos(latitude);
    float sinLat = sin(latitude);
    float cosLon = cos(longitude);
    float sinLon = sin(longitude);

    float N_Phi = a / sqrt(1.0 - e2 * sinLat * sinLat);
    float h = particleHeight; // it should be high enough otherwise the particle may not pass the terrain depth test足够高  防止没通过地形 深度检测

    vec3 cartesian = vec3(0.0);
    cartesian.x = (N_Phi + h) * cosLat * cosLon;
    cartesian.y = (N_Phi + h) * cosLat * sinLon;
    cartesian.z = ((b * b) / (a * a) * N_Phi + h) * sinLat;
    return cartesian;
}
// 经纬度转cesium世界坐标系
vec4 calculateProjectedCoordinate(vec3 lonLatLev) {
    // the range of longitude in Cesium is [-180, 180] but the range of longitude in the NetCDF file is [0, 360]
    // [0, 180] is corresponding to [0, 180] and [180, 360] is corresponding to [-180, 0]
    lonLatLev.x = mod(lonLatLev.x + 180.0, 360.0) - 180.0;
    vec3 particlePosition = convertCoordinate(lonLatLev);
    vec4 projectedCoordinate = czm_modelViewProjection * vec4(particlePosition, 1.0);
    return projectedCoordinate;
}

vec4 calculateOffsetOnNormalDirection(vec4 pointA, vec4 pointB, float offsetSign) {
    vec2 aspectVec2 = vec2(aspect, 1.0);
    vec2 pointA_XY = (pointA.xy / pointA.w) * aspectVec2;
    vec2 pointB_XY = (pointB.xy / pointB.w) * aspectVec2;

    float offsetLength = lineWidth / 2.0;
    vec2 direction = normalize(pointB_XY - pointA_XY);
    vec2 normalVector = vec2(-direction.y, direction.x);
    normalVector.x = normalVector.x / aspect;
    normalVector = offsetLength * normalVector;

    vec4 offset = vec4(offsetSign * normalVector, 0.0, 0.0);
    return offset;
}

vec4 calculateOffsetOnMiterDirection(adjacentPoints projectedCoordinates, float offsetSign) {
    vec2 aspectVec2 = vec2(aspect, 1.0);

    vec4 PointA = projectedCoordinates.previous;
    vec4 PointB = projectedCoordinates.current;
    vec4 PointC = projectedCoordinates.next;

    vec2 pointA_XY = (PointA.xy / PointA.w) * aspectVec2;
    vec2 pointB_XY = (PointB.xy / PointB.w) * aspectVec2;
    vec2 pointC_XY = (PointC.xy / PointC.w) * aspectVec2;

    vec2 AB = normalize(pointB_XY - pointA_XY);
    vec2 BC = normalize(pointC_XY - pointB_XY);

    vec2 normalA = vec2(-AB.y, AB.x);
    vec2 tangent = normalize(AB + BC);
    vec2 miter = vec2(-tangent.y, tangent.x);

    float offsetLength = lineWidth / 2.0;
    float projection = dot(miter, normalA);
    vec4 offset = vec4(0.0);
    // avoid to use values that are too small
    if (projection > 0.1) {
        float miterLength = offsetLength / projection;
        offset = vec4(offsetSign * miter * miterLength, 0.0, 0.0);
        offset.x = offset.x / aspect;
    } else {
        offset = calculateOffsetOnNormalDirection(PointB, PointC, offsetSign);
    }

    return offset;
}