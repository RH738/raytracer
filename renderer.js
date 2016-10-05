var width = 800;
var height = 600;
var rays = [];
var opticalElements = [];

for (var i = 0; i < 10000; i++) {
    rays[i] = new Ray(0, 0, Math.random() * width - width / 2, Math.random() * height - height / 2);
}

for (var i = 0; i < 10; i++) {
    // opticalElements.push(
    //     new Mirror(
    //         new THREE.Vector2(Math.random() * width - width / 2, Math.random() * height - height / 2),
    //         Math.deg2rad * Math.random() * 180,
    //         100
    //     )
    // )
    var randomVector = new THREE.Vector2(Math.random(), Math.random());
    randomVector.setLength(300);

    var startVector = new THREE.Vector2(Math.random() * width - width / 2, Math.random() * height - height / 2);
    var endVector = startVector.clone().add(randomVector);

    // opticalElements.push(
    //     new FlatSurface(
    //         startVector.x, startVector.y,
    //         endVector.x, endVector.y,
    //         "diffractive", 1.0, 1.5))
}

rays[0] = new Ray(0, 0, 1, 1);
opticalElements.push(new FlatSurface(100, -500, 100, 500, "diffractive", 4, 3))
// opticalElements.push(new FlatSurface(-100, -500, -100, 500, "diffractive", 1.0, 10))
// opticalElements.push(new FlatSurface(-500, 100, 500, 100, "diffractive", 1.0, 1.5))


var scene = new THREE.Scene();
camera = new THREE.OrthographicCamera(-width, width, -height, height, -500, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
$("#raytracer").append(renderer.domElement)


camera.position.z = 5;

for (var i = 0; i < rays.length; i++) {
    rays[i].propagate(opticalElements)
}

//draw optical elements
for (var i = 0; i < opticalElements.length; i++) {
    opticalElements[i].draw(scene);
}
//draw rays
var rayRenderObject = createRaySceneObject(rays)
scene.add(rayRenderObject);

var render = function() {
    // requestAnimationFrame(render);
    renderer.render(scene, camera);
};

render();

function updateRayOpacity(opacity) {
    rayRenderObject.material.opacity = opacity;
    render()
}
