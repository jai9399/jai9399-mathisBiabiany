var scene,camera,renderer,plane,container = document.getElementById('container');
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var controls;
function init(){
    console.log(container)
    var width = container.offsetWidth;
    var height = container.offsetHeight;
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 70, width / height, 1, 1000 );
    scene.add(camera);
    renderer = new THREE.WebGLRenderer({anitalias:true});
    renderer.setPixelRatio(container.devicePixelRatio);
    renderer.setSize(container.offsetWidth,container.offsetHeight);
    renderer.setClearColor(0xffffff,1.0);
    document.getElementById('container').appendChild(renderer.domElement);
    var planeGeo = new THREE.PlaneBufferGeometry(1,1);
    var texture = new THREE.TextureLoader().load( 'ironman.png' );
    var mat = new THREE.MeshBasicMaterial( {color: 0x000f00, side: THREE.DoubleSide} );
    var mat2 = new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide,transparent:true});
    var mat3 = new THREE.ShaderMaterial( {
        side:THREE.DoubleSide,
        uniforms:{
        progress:{type:"f",value:0.0},
        mousevalue:{type:'v2',value: new THREE.Vector3()},
        time:{type:"f",value:0.0},
        resolution:{type:"v2",value: new THREE.Vector4(width,height,0.0,0.0)},
        texture1: { type: "t", value: new THREE.TextureLoader().load( "img.jpg" )},
      //  texture2:{type:"t", value: new THREE.TextureLoader().load( "dispmap.png" )}
        },
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent
                               
    
} );

    camera.position.set(0,0,2);
    
    camera.lookAt(new THREE.Vector3(0,0,0));
    plane = new THREE.Mesh(planeGeo,mat3);
    scene.add(plane);
    //plane.position.set(0,0,1);
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    //controls.target.set(0,0,1); //to change deafult position of roatation for the plane which is (0,0)
    //plane.position.set(0,0,2);
   // plane.scale.set(width,height,1);
    var controller = new function() {
        this.progress = 0;
          }();
    var gui = new dat.GUI();
    gui.add(controller,'progress',0.0,1.0).onChange(function(){
        plane.material.uniforms.progress.value = controller.progress;
        console.log(controller.progress);
    });
//     container.addEventListener('mouseover',()=>{
//         plane.material.uniforms.progress.value = 0.5
            
        
//    })
//    container.addEventListener('mouseout',()=>{
//     plane.material.uniforms.progress.value = 0.0;
// })
    oncontainerResize();
    animate();
}
function oncontainerResize(){
    var w = container.offsetWidth;
    var h = container.offsetHeight;
    renderer.setSize( w, h );
    camera.aspect = w/h;
    //plane.scale.set( w, h, 1 );
    const dist = camera.position.z;
    const height = 1;
    camera.fov = 2*(180/Math.PI)*Math.atan(height/(2*dist))
    plane.material.uniforms.resolution.value.x = w;
    plane.material.uniforms.resolution.value.y = h;

    var imageAspect = 853/1280;
    let a1,a2;
    if(h/w>imageAspect){
        a1 = (w/h)*imageAspect;
        a2=1;
    }
    else{
        a1=1;
        a2 = (h/w)/imageAspect;
    }
    plane.material.uniforms.resolution.value.z = a1; //Added to preserve aspect ratio of image on plane
    plane.material.uniforms.resolution.value.w = a2;
    
    if(w/h>1){
       plane.scale.x = camera.aspect;
    }
    else{
        plane.scale.y = 1/camera.aspect;
    }
    camera.updateProjectionMatrix();
    
}
init();

function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera( mouse, camera );

	// calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects( scene.children );
    console.log(intersects)
    if(intersects){
        console.log(intersects[0].point)
        plane.material.uniforms.mousevalue.value =new THREE.Vector3((intersects[0].uv.x-0.5),(intersects[0].uv.y-0.5),0) ;
    }
	// for ( var i = 0; i < intersects.length; i++ ) {
    //       console.log(intersects)

	// }
    
    

}
window.addEventListener( 'resize', oncontainerResize);
window.addEventListener( 'mousemove', onMouseMove);
function animate() {
    requestAnimationFrame( animate );
    plane.material.uniforms.time.value += 0.05;
    renderer.render(scene,camera);
    controls.update();
}    