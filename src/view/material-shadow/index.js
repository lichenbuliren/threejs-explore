import * as THREE from 'three';
import {
  Detector,
  Helper
} from '../../util/';
import {
  dat,
  Stats
} from '../../lib/';
require('../index.css');

let init = () => {
  var scene, camera, renderer, spotLight, spotLightHelper;
  let stats, dat;
  var controlObj = {
    cameraX: 0,
    cameraY: 0,
    cameraZ: 0
  };
  var keyRangeObj = {
    cameraX: [-200, 200],
    cameraY: [-200, 200],
    cameraZ: [-200, 200]
  }

  scene = sceneInit();
  camera = cameraInit(scene);
  renderer = rendererInit();
  stats = statsInit();
  dat = datInit(controlObj, keyRangeObj);

  // 业务逻辑
  var spotLight = spotLightInit(scene);
  // 添加平面几何体
  var planeGeometry = new THREE.PlaneGeometry(60, 20);
  var planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xcccccc
  });
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -0.5 * Math.PI;
  plane.receiveShadow = true;
  plane.position.x = 15;
  plane.position.y = 0;
  plane.position.z = 0;
  scene.add(plane);

  var cubeGeometry = new THREE.CubeGeometry(4, 4, 4);
  var cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0xff0000
  });
  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(-4, 3, 0);
  cube.castShadow = true;
  scene.add(cube);

  var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
  var sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0x7777ff
  });
  var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(20, 4, 2);
  sphere.castShadow = true;
  scene.add(sphere);

  helperInit(scene, spotLight);

  let resize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  let progress = (cube, controlObj) => {

  }

  let render = (progressFn) => {
    progressFn();
    renderer.render(scene, camera);
    requestAnimationFrame(function () {
      render(progressFn);
    });
  }

  render(function () {
    stats.begin();
    progress(cube, controlObj);
    stats.end();
  });

  window.addEventListener('resize', Helper.throttle(resize, 500), false);
}

let statsInit = () => {
  var stats = new Stats();
  // 0: fps, 1: ms, 2: mb, 3+: custom
  stats.showPanel(0);
  document.body.appendChild(stats.dom);
  return stats;
}

let datInit = (controlObj, keyRangeObj) => {
  var gui = new dat.GUI();
  for (var key in keyRangeObj) {
    gui.add(controlObj, key, keyRangeObj[key][0], keyRangeObj[key][1]);
  }
  return gui;
}

let sceneInit = () => {
  return new THREE.Scene();
}

let cameraInit = (scene) => {
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 20, 120);
  camera.lookAt(scene);
  return camera;
}

let rendererInit = () => {
  var renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xEEEEEE);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);
  return renderer;
}

let spotLightInit = (scene) => {
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-30, 60, -10);
  spotLight.castShadow = true;
  scene.add(spotLight);
  return spotLight;
}

let helperInit = (scene, spotLight) => {
  var axisHelper = new THREE.AxisHelper(20);
  var spotLightHelper = new THREE.SpotLightHelper(spotLight);
  scene.add(spotLightHelper);
  scene.add(axisHelper);
}

let resize = (camera, renderer) => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onload = init();