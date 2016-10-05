function Ray(x, y, dx, dy, reflectionDepth) {
    this.dir = new THREE.Vector2(dx, dy)
    this.dir.normalize();

    this.startPoint = new THREE.Vector2(x + this.dir.x, y + this.dir.y)
    this.endPoint = new THREE.Vector2(x + this.dir.x * 1e4, y + this.dir.y * 1e4)
    this.reflectionDepth = reflectionDepth || 0
}

Ray.prototype.propagate = function(scene) {
    if (this.reflectionDepth < 3) {
        var clstRef = undefined;
        var record = 1e10
        for (var i = 0; i < scene.length; i++) {
            if (scene[i].intersectionType == "line") {
                var hit = Intersection.intersectLineLine(scene[i].startPoint, scene[i].endPoint, this.startPoint, this.endPoint);
                if (hit.status === "Intersection") {
                    var distance = new THREE.Vector2(
                        hit.points[0].x - this.startPoint.x,
                        hit.points[0].y - this.startPoint.y
                    ).length();
                    if (distance < record && distance > 1) {
                        record = distance;
                        clstRef = {
                            hitObj: hit,
                            obj: scene[i]
                        };
                    }
                }
            }
        }
        if (clstRef !== undefined) {
            var hitPoint = new THREE.Vector2(clstRef.hitObj.points[0].x, clstRef.hitObj.points[0].y);
            var direction = new THREE.Vector2(
                hitPoint.x - this.startPoint.x,
                hitPoint.y - this.startPoint.y);

            var surfaceTangent = new THREE.Vector2(
                clstRef.obj.startPoint.x - hitPoint.x,
                clstRef.obj.startPoint.y - hitPoint.y
            );
            surfaceTangent.normalize();
            var surfaceNormal = new THREE.Vector2(surfaceTangent.y, -surfaceTangent.x);
            var surfaceAngle = Math.acos(surfaceTangent.dot(new THREE.Vector2(0, 1)));

            if (clstRef.obj.type === "orientedMirror" || clstRef.obj.type === "reflective") {
                direction.rotateAround(new THREE.Vector2(), surfaceAngle)
                direction.y = -direction.y
                direction.rotateAround(new THREE.Vector2(), -surfaceAngle)
            } else if (clstRef.obj.type === "diffractive") {
                if (surfaceNormal.dot(direction) < 0) {
                    // surfaceNormal.negate();
                }
                var refDiv = clstRef.obj.refractiveIndexBefore / clstRef.obj.refractiveIndexAfter;

                var alpha = Math.acos(surfaceTangent.dot(direction.clone().normalize()))
                alpha = alpha > Math.PI / 2 ? Math.PI - alpha : alpha;
                alpha = Math.PI / 2 - alpha;


                var sinSquare = refDiv * refDiv * Math.pow(Math.sin(alpha), 2)
                direction.normalize()
                direction = direction.clone().multiplyScalar(refDiv).add(surfaceNormal.clone().multiplyScalar(refDiv*Math.cos(alpha) - Math.sqrt(1 - sinSquare)))
            }



            var nextRay = new Ray(hitPoint.x, hitPoint.y, direction.x, direction.y, this.reflectionDepth + 1)
            rays.push(nextRay)
            this.endPoint = hitPoint

        }
    }
}



function createRaySceneObject(rays) {
    var geometry = new THREE.BufferGeometry();
    var material = new THREE.LineBasicMaterial({
        vertexColors: THREE.VertexColors,
        blending: THREE.AdditiveBlending,
        opacity: 1,
        transparent: true
    });

    // var positions = new Float32Array( rays.length * 2 * 3 );
    // var colors = new Float32Array( rays.length * 2 * 3 );
    var positions = []
    var colors = []
    var indexArray = [];
    var currentIndex = 0;
    for (var i = 0; i < rays.length; i++) {
        positions.push(rays[i].startPoint.x);
        positions.push(rays[i].startPoint.y);
        positions.push(0);
        colors.push(1);
        colors.push(1);
        colors.push(1);
        indexArray.push(currentIndex++)

        positions.push(rays[i].endPoint.x);
        positions.push(rays[i].endPoint.y);
        positions.push(0);
        colors.push(1);
        colors.push(1);
        colors.push(1);
        indexArray.push(currentIndex++)
    }

    geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indexArray), 1));
    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
    geometry.computeBoundingSphere();

    return new THREE.LineSegments(geometry, material);
}
