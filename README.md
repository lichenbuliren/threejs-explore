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

### 材质 Materail
threejs 里面有两种材质会对光源产生反应：`MeshLamberMaterial` 和 `MeshPhongMaterial`;
其中 `MeshBasicMaterial` 材质不会对光源产生反应，而只会以指定的颜色渲染物体, 具体可查看 Demo `spinning-cube`;

### 遍历场景中的元素
```javascript
// 其中 e 就是场景中的所有元素
scene.traverse(function (e) {}
```

### 使用多个材质创建几何体
Threejs 在使用多个材质创建几何体的时候，其实会创建多个几何体对象，然后将它们归为一组对象
``` javascript
var clonedGeometry = mesh.children[0].geometry.clone();
var materials = [
	new THREE.MeshLambertMaterial({opacity: 0.6, color: 0xff44ff, transparent: true}),
	new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true})
];

var mesh2 = THREE.SceneUtils.createMultiMaterialObject(clonedGeometry, materials);
// 这里的 mesh2 包含两个对象，分别对应多个材质
mesh2.children.forEach(function (e) {
	e.castShadow = true
});
```

### 鼠标点击场景中的物体事件
``` javascript
function onDocumentMouseDown(event) {
	// 计算点击处的向量
	var vector = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1, 0.5);

	// vector.unproject 方法将屏幕上的点击位置转换为 Three.js 场景中的坐标。换句话说，我们从屏幕坐标到世界坐标
	vector = vector.unproject(camera);

	// THREE.Raycaster 可以将光线投射到我们的场景中。
	// 从摄像机的位置发射一个射线到我们在场景中点击的位置
	var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

	// raycaster.intersectObjects 方法，通过射线来判断给定的物体中是否有被射线命中的对象
	var intersects = raycaster.intersectObjects([sphere, cylinder, cube]);

	if (intersects.length > 0) {
			console.log(intersects[0]);
			intersects[0].object.material.transparent = true;
			intersects[0].object.material.opacity = 0.1;
	}
}
```
