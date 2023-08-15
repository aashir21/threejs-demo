import * as THREE from  "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import gsap from "gsap";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import TWEEN from "@tweenjs/tween.js"



//IMPORTS
const canvasContainer = document.getElementById("canvas-container") as HTMLBodyElement
const featureCanvas = document.getElementById("feature-canvas") as HTMLCanvasElement

//LOADING MANAGER-------

const loader = new THREE.LoadingManager();

loader.onStart = () => {
  
  const loading = document.getElementById("loader-section") as HTMLBodyElement;

  loading.style.display = "block"
  
}

loader.onLoad = ()=>{
  console.log("Model Loaded...");
  const loading = document.getElementById("loader-section") as HTMLBodyElement;

  loading.style.display = "none"
  
}

//----------------------------

//SCENES---------------------
const scene = new THREE.Scene();
const scene2 = new THREE.Scene();

scene.background = new THREE.Color(0xffffff)
scene2.background = new THREE.Color(0xffffff)

//--------------

//CAMERA----------------

const camera = new THREE.PerspectiveCamera(75,canvasContainer?.clientWidth/canvasContainer?.clientHeight)
camera.position.set(-2, 0 ,3.75);

const camera2 = new THREE.PerspectiveCamera(75,canvasContainer?.clientWidth/canvasContainer?.clientHeight,0.1,1000)
camera2.position.set(1.5,2,1);

//------------------------------


//RENDERERS-------------
const renderer = new THREE.WebGLRenderer({antialias: false, alpha: true, powerPreference: "high-performance"});
renderer.setSize(canvasContainer?.clientWidth,canvasContainer?.clientHeight)
renderer.render(scene,camera);
renderer.setPixelRatio( window.devicePixelRatio );
document.body.appendChild(renderer.domElement);

const renderer2 = new THREE.WebGLRenderer({canvas:featureCanvas,antialias: false, alpha: true, powerPreference: "high-performance"});
renderer2.setSize(canvasContainer?.clientWidth,canvasContainer?.clientHeight)
renderer2.setPixelRatio( window.devicePixelRatio );
renderer2.render(scene2,camera2);
//-------------------------//

//CONTROLS-------------------
const controls = new OrbitControls(camera,renderer.domElement);
controls.enablePan = false  
controls.enableZoom = false
controls.enableRotate = false;

const controls2 = new OrbitControls(camera2, renderer2.domElement)
controls2.enablePan = false  
controls2.enableZoom = false 
controls2.enableRotate = false;

//-----------------------------

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.render(scene,camera)
    renderer2.render(scene2,camera2)
}

const options = document.querySelectorAll(".options");

options.forEach(option => {
  option.addEventListener('click', () =>{
    document.querySelector('.active')?.classList.remove('active')
    option.classList.add('active')
  })
})


//MODEL LOADING---------

const gltfLoader = new GLTFLoader(loader)
const rgbeloader = new RGBELoader()

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 4;

renderer2.toneMapping = THREE.ACESFilmicToneMapping;
renderer2.toneMappingExposure = 4;

let car: any;

rgbeloader.load('static/poly_haven_studio_2k.hdr',function(texture){
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.environment = texture;
  scene2.environment = texture
  gltfLoader.load('static/scene.gltf', function(gltf){
    const model = gltf.scene;
    model.position.set(-0.5, -1 ,-0.25)
    car = model;
    scene.add(model)
    scene2.add(SkeletonUtils.clone(model))
  })
})
//----------------------------



function animate(){
  requestAnimationFrame(animate)

  if(car){
    car.rotation.y += 0.001
  }

  TWEEN.update()
  renderer2.render(scene2, camera2)
  controls2.update()
  controls.update()
  renderer.render(scene,camera);
}


animate()


//TWEEN JS

function moveCamera(position : any){
  console.log("animating....");
  
  new TWEEN.Tween(camera2.position).to(position, 1800).easing(TWEEN.Easing.Quadratic.InOut).start()
}


//EVENT LISTENERS

const body = document.getElementById("body-option") as HTMLBodyElement
const spoiler = document.getElementById("spoiler-option") as HTMLBodyElement
const headlights = document.getElementById("headlights-option") as HTMLBodyElement
const tyres = document.getElementById("tyres-option") as HTMLBodyElement
const para = document.getElementById("feature-para") as HTMLBodyElement

spoiler?.addEventListener("click", ()=>{
  para.innerText = "The 1975 Porsche 911 Turbo is often associated with its signature whale tail spoiler, which is a rear aerodynamic element. This spoiler serves multiple purposes: it provides downforce on the rear wheels for improved traction and stability, it aids in managing airflow over the car's body, and it adds a unique visual flair to the car's rear end. The spoiler's shape and size contribute to the car's overall performance and aesthetics."
  gsap.fromTo("#feature-para", {opacity: 0}, {opacity: 1, duration: 1.5})
  moveCamera({x:-1.6,y:0.2,z:-2.9})
})

body?.addEventListener("click", ()=>{
  para.innerText = "The body of the Porsche 911 Turbo 1975 features a classic and iconic design. It maintains the distinctive silhouette of the Porsche 911 series, with a sloping roofline, curvaceous fenders, and a compact front end. The body is characterized by its smooth, aerodynamic lines, which contribute to the car's overall performance and aesthetic appeal."
  gsap.fromTo("#feature-para", {opacity: 0}, {opacity: 1, duration: 1.5})
  moveCamera({x:1.5,y:2,z:1})
})

headlights?.addEventListener("click", ()=>{
  para.innerText = "The headlights of the 1975 Porsche 911 Turbo are a distinctive part of its design. They are typically round and integrated into the front fascia of the car. These headlights provide illumination for nighttime driving and contribute to the car's overall aesthetic by adding to its unique and recognizable front-end appearance."
  gsap.fromTo("#feature-para", {opacity: 0}, {opacity: 1, duration: 1.5})
  moveCamera({x:-2,y:0.2,z:2.8})
})

tyres?.addEventListener("click", ()=>{
  para.innerText = "The 1975 Porsche 911 Turbo's tyres are wider than those of the standard 911 models. This increased width provides improved grip and traction, which is especially important for a high-performance car like the Turbo. The wider tyres also contribute to better handling and stability, particularly when navigating tight corners and high-speed maneuvers."
  gsap.fromTo("#feature-para", {opacity: 0}, {opacity: 1, duration: 1.5})
  moveCamera({x:1.5,y:-0.3,z:2.8})
})


/// GSAP

const timeline = gsap.timeline({defaults: {duration: 1, ease:"power4.out"}});

timeline.fromTo(".car-name", {opacity: 0}, {opacity: 1})
timeline.fromTo("#canvas-container", {opacity: 0}, {opacity: 1})
timeline.fromTo(".navbar",{y: "-100%"}, {y  : "0"})
timeline.fromTo(".info-card", {opacity: 0}, {opacity:1, duration: 1.5})