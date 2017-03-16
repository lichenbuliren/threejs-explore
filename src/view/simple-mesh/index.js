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
    cameraX: 20,
    cameraY: 17,
    cameraZ: 18
  };
  var keyRangeObj = {
    cameraX: [0, 30],
    cameraY: [0, 30],
    cameraZ: [0, 30],
  }

  scene = sceneInit();
  camera = cameraInit(scene);
  renderer = rendererInit();
  stats = statsInit();
  spotLight = spotLightInit(scene);

  dat = datInit(controlObj, keyRangeObj);
  scene.add(spotLight);

  // 业务逻辑
  var cubeGeometry = new THREE.CubeGeometry(6, 4, 6);
  var cubeMaterial = new THREE.MeshLambertMaterial({
    color: 'red'
  });
  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.castShadow = true;
  scene.add(cube);
  
  var planeGeometry = new THREE.PlaneGeometry(20, 20);
  var planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xcccccc
  });
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  plane.rotation.x = -0.5*Math.PI;
  plane.position.y = -2;
  scene.add(plane);

  helperInit(scene, spotLight);

  let progress = (camera, controlObj) => {
    camera.position.x = controlObj.cameraX;
    camera.position.y = controlObj.cameraY;
    camera.position.z = controlObj.cameraZ;
  }

  let render = (progressFn) => {
    progressFn();
    renderer.render(scene, camera);
    requestAnimationFrame(() => render(progressFn));
  }

  render(function () {
    stats.update();
    progress(camera, controlObj);
  });

  window.addEventListener('resize', Helper.throttle(resize(camera, renderer), 500), false);
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
  camera.position.x = 20;
  camera.position.y = 16;
  camera.position.z = 18;
  camera.lookAt(scene.position);
  return camera;
}

let rendererInit = () => {
  var renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 1);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);
  return renderer;
}

let spotLightInit = (scene) => {
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(10, 20, 20);
  spotLight.castShadow = true;
  scene.add(spotLight);
  return spotLight;
}

let helperInit = (scene, spotLight) => {
  var axisHelper = new THREE.AxisHelper(200);
  var spotLightHelper = new THREE.SpotLightHelper(spotLight);
  scene.add(spotLightHelper);
  scene.add(axisHelper);
}

let resize = (camera, renderer) => {
  return () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

window.onload = init();