import * as THREE from 'three';
require('../index.css');

window.onload = () => {
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 500);
  camera.position.set(10, 20, 20);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  var cameraHelper = new THREE.CameraHelper( camera );
  
  var scene = new THREE.Scene();
  var material = new THREE.LineBasicMaterial({
    color: 0x0000ff,
    linewidth: 20
  });
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(-10, 0, 0));
  geometry.vertices.push(new THREE.Vector3(0, 10, 0));
  geometry.vertices.push(new THREE.Vector3(10, 0, 0));

  var line = new THREE.Line(geometry, material);
  scene.add(line);
  var axisHelper = new THREE.AxisHelper(100);
  scene.add( axisHelper );
  // scene.add( cameraHelper );
  renderer.render(scene, camera);
}