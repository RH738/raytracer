var width = 800;
var height = 600;
var rays = [];
var opticalElements = [];

for (var i = 0; i < 500; i++) {
    rays[i] = new Ray(0, 0, Math.random() * width - width / 2, Math.random() * height - height / 2);
}

for (var i = 0; i < 10; i++) {
    opticalElements.push(
        new Mirror(
            new THREE.Vector2(Math.random() * width - width / 2, Math.random() * height - height / 2),
            Math.deg2rad * Math.random() * 180,
            100
        )
    )
}


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
