function Mirror(position, rotation, size, type) {
    this.intersectionType = "line"
    this.type = type || "orientedMirror";
    this.size = size
    this.position = position
    this.rotation = rotation
    var r1 = new THREE.Vector2(-this.size, 0)
    var r2 = new THREE.Vector2(this.size, 0)
    r1.rotateAround(new THREE.Vector2(), rotation)
    r2.rotateAround(new THREE.Vector2(), rotation)
    this.startPoint = new THREE.Vector2(this.position.x + r1.x, this.position.y + r1.y)
    this.endPoint = new THREE.Vector2(this.position.x + r2.x, this.position.y + r2.y)
}

Mirror.prototype.draw = function(scene) {
    var material = new THREE.LineBasicMaterial({
        color: 0xAA0000
    });
    var geometry = new THREE.Geometry();
    geometry.vertices.push(
        new THREE.Vector3(this.startPoint.x, this.startPoint.y, 0),
        new THREE.Vector3(this.endPoint.x, this.endPoint.y, 0)
    );

    var line = new THREE.Line(geometry, material);
    scene.add(line);
}

function FlatSurface(x1, y1, x2, y2, type, refractiveIndex1, refractiveIndex2){
    this.intersectionType = "line"
    this.type = type || "reflective";
    this.startPoint = new THREE.Vector2(x1,y1);
    this.endPoint = new THREE.Vector2(x2,y2);
    this.refractiveIndexBefore = refractiveIndex1 || 1.0;
    this.refractiveIndexAfter = refractiveIndex2 || 1.0;
}

FlatSurface.prototype.draw = function(scene) {
    var material = new THREE.LineBasicMaterial({
        color: 0xFF00FF
    });
    var geometry = new THREE.Geometry();
    geometry.vertices.push(
        new THREE.Vector3(this.startPoint.x, this.startPoint.y, 0),
        new THREE.Vector3(this.endPoint.x, this.endPoint.y, 0)
    );

    var line = new THREE.Line(geometry, material);
    scene.add(line);
}
// function Surface(position, polygonm)

Math.deg2rad = Math.PI / 180;
Math.rad2deg = 180 / Math.PI;
