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
    rotationX: 0.01,
    rotationY: 0.01
  };
  var keyRangeObj = {
    rotationX: [0.01, 0.1],
    rotationY: [0.01, 0.1]
  }

  scene = sceneInit();
  camera = cameraInit();
  renderer = rendererInit();
  stats = statsInit();
  dat = datInit(controlObj, keyRangeObj);

  // 业务逻辑
  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshLambertMaterial({
    color: 0x00ff00
  });
  var cube = new THREE.Mesh(geometry, material);

  var geometry2 = new THREE.BoxGeometry(1, 1, 1);
  var basicMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00
  });
  var cube2 = new THREE.Mesh(geometry2, basicMaterial);
  cube2.position.set(-3, -1, 0);
  cube2.rotation.x = 0.5;
  var spotLight = spotLightInit();
  scene.add(cube);
  scene.add(cube2);
  scene.add(spotLight);

  helperInit(scene, spotLight);

  let resize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  let progress = (cube, controlObj) => {
    cube.rotation.x += controlObj.rotationX;
    cube.rotation.y += controlObj.rotationY;
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

let cameraInit = () => {
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 10;
  return camera;
}

let rendererInit = () => {
  var renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 1);
  document.body.appendChild(renderer.domElement);
  return renderer;
}

let spotLightInit = () => {
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(10, 10, 30);
  spotLight.castShadow = true;
  return spotLight;
}

let helperInit = (scene, spotLight) => {
  var axisHelper = new THREE.AxisHelper(200);
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