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
  var scene, camera, renderer, spotLight, spotLightHelper, cameraControl;
  let stats, dat;
  var controlObj = {
    rotation: 0.001
  };
  var keyRangeObj = {
    rotation: [0.001, 0.1]
  }

  scene = sceneInit();
  camera = cameraInit(scene);
  renderer = rendererInit();
  stats = statsInit();
  spotLight = spotLightInit(scene);

  dat = datInit(controlObj, keyRangeObj);

  // 业务逻辑
  var sphereGeometry = new THREE.SphereGeometry(15, 20, 20);
  var sphereMaterial = new THREE.MeshNormalMaterial();
  sphereMaterial.wireframe = true;
  var earthMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  earthMesh.name = 'earth';
  scene.add(earthMesh);

  // var planeGeometry = new THREE.PlaneGeometry(20, 20);
  // var planeMaterial = new THREE.MeshLambertMaterial({
  //   color: 0xcccccc
  // });
  // var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  // plane.receiveShadow = true;
  // plane.rotation.x = -0.5*Math.PI;
  // plane.position.y = -2;
  // scene.add(plane);

  helperInit(scene, spotLight);

  let progress = (earthMesh, controlObj) => {
    earthMesh.rotation.y += controlObj.rotation;
  }

  let render = (progressFn) => {
    progressFn();
    renderer.render(scene, camera);
    requestAnimationFrame(() => render(progressFn));
  }

  render(function () {
    stats.update();
    progress(earthMesh, controlObj);
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
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.x = 35;
  camera.position.y = 36;
  camera.position.z = 33;
  camera.lookAt(scene.position);
  // cameraControl = new THREE.OrbitControls(camera, renderer.domElement);
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
  // scene.add(spotLightHelper);
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