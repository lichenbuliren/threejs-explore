import * as THREE from 'three';
import {
  Detector,
  Helper
} from '../../util/';
import { dat, stats } from '../../lib/';
require('../index.css');

window.onload = () => {
  var scene = new THREE.Scene();
  var renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 1);
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  document.body.appendChild(renderer.domElement);

  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshLambertMaterial({
    color: 0x00ff00
  });
  var cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(10, 10, 30);
  spotLight.castShadow = true;
  scene.add(spotLight);

  var spotLightHelper = new THREE.SpotLightHelper(spotLight);
  scene.add(spotLightHelper);

  var axisHelper = new THREE.AxisHelper(200);
  scene.add(axisHelper);

  var controlObj = {
    rotationX: 0.01,
    rotationY: 0.01
  };

  var gui = new dat.GUI();
 
  gui.add(controlObj, 'rotationX', 0.01, 0.1);
  gui.add(controlObj, 'rotationY', 0.01, 0.1);

  if (Detector.webgl) {
    render();
  } else {
    var warning = Detector.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);
  }

  function render() {
    requestAnimationFrame(render);
    cube.rotation.x += controlObj.rotationX;
    cube.rotation.y += controlObj.rotationY;
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', Helper.throttle(resize, 500), false);

  function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render();
}