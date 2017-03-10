## Three.js 探索
### 基础框架
要使用 threejs，需要基础的三样东西：场景-scene, 相机-camera, 渲染器-renderer
``` javascript
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
```
### 在场景中的物体
在 threejs 中的物体，大部分由基础两个部分组成：几何体 + 材质 = 多边形；
``` javascript
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;
```
### 使用 renderer 场景渲染
``` javascript
function render() {
	requestAnimationFrame( render );
	renderer.render( scene, camera );
}
render();
```
