let material;
//scene
const scene = new THREE.Scene()
scene.fog = new THREE.Fog(0xf9f9f9, 1, 1000);
//camera
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 1, 10000)
camera.position.set(-150, 30, 150)

const mapHeight = new THREE.TextureLoader().load("./assets/texture/floor.jpg");
mapHeight.wrapS = mapHeight.wrapT = THREE.RepeatWrapping;
mapHeight.repeat.set(20, 20);
mapHeight.anisotropy = 32;
mapHeight.encoding = THREE.sRGBEncoding;

const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshStandardMaterial
    ({ color: 0xf5f5f5, depthWrite: true, bumpMap: mapHeight, bumpScale: 6 }));
mesh.position.y = -50;
mesh.rotation.x = - Math.PI / 2;
mesh.receiveShadow = true;
scene.add(mesh);

//renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio || 1)
renderer.setClearColor('#f9f9f9', 1.0)
renderer.shadowMap.enabled = true;
renderer.shadowMap.autoUpdate = true;
renderer.gammaFactor = 2.2;//Correcting the scenes Gamma Values
renderer.gammaFactor = true;
renderer.outputEncoding = THREE.GammaEncoding;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap   
renderer.setSize(innerWidth, innerHeight)
document.querySelector('#canvas').appendChild(renderer.domElement)

//resize
window.addEventListener('resize', function () {
    renderer.setSize(this.innerWidth, this.innerHeight)
    camera.aspect = this.innerWidth / this.innerHeight
    camera.updateProjectionMatrix(0)
})
//control
const controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.target.set(0, 0, 0);
controls.update();
controls.enableZoom = true;
controls.minAzimuthAngle = Infinity;
controls.maxAzimuthAngle = Infinity;
controls.minDistance = 150;
controls.maxDistance = 350;
controls.minPolarAngle = 0.8; // radians
controls.maxPolarAngle = 1.5 // radians
controls.rotateSpeed = 0.5;
controls.zoomSpeed = 0.5;
controls.panSpeed = 0.8;
controls.autoRotate = false
controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: false };
controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE };

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
hemiLight.position.set(0, 200, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.position.set(100, 100, 100);
dirLight.castShadow = true;
dirLight.shadow.camera.top = 300;
dirLight.shadow.camera.bottom = - 300;
dirLight.shadow.camera.left = - 300;
dirLight.shadow.camera.right = 300;
dirLight.shadow.bias = 0.0001;
dirLight.shadow.radius = 8;
dirLight.shadow.needsUpdate = true;
dirLight.shadow.mapSize.width = 4096;
dirLight.shadow.mapSize.height = 4096;
dirLight.shadow.camera.far = 600;
scene.add(dirLight);


const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight2.position.set(100, -100, 100);
scene.add(dirLight2);
// new RGBELoader()
// .setDataType( THREE.UnsignedByteType )
//     .setPath( 'texture/' )
//     .load( 'test.hdr', function ( texture ) {

//         const envMap = pmremGenerator.fromEquirectangular( texture ).texture;

//         scene.background = envMap;
//         scene.environment = envMap;


//         texture.dispose();
//         pmremGenerator.dispose();

//         render();
//load model
// const loader = new THREE.GLTFLoader()
// loader.load('assets/models/gltf/gltf02.gltf', function (gltf) {
//    object = gltf.scene
var objGroup = new THREE.Object3D()
objGroup.name = 'objGroup'
scene.add(objGroup)

var targetObj
let color

const loader = new THREE.FBXLoader()
loader.load('./assets/models/fbx/serif.FBX', function (object) {
    object.scale.set(0.1, 0.1, 0.1)
    object.position.set(0.1, -50, 0.15)
    object.name = 'object'
    object.traverse(function (child) {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.transparent = true;
            child.material.dithering = true;
            // child.renderOrder= 1;
            //  child.material.alphaTest = 0.01;
            child.material.depthTest = true
            child.material.opacity = 1;
            //  child.material.wireframe = true;
        }
    })
    objGroup.add(object)

    targetObj = object.children.find(i => i.name === 'serif')
    targetObj2 = object.children.find(i => i.name === 'back')

    //event
    const buttons = document.querySelectorAll('.pickColors')
    const rgba2hex = rgba =>
        `#${rgba
            .match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/)
            .slice(1)
            .map((n, i) =>
                (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n))
                    .toString(16)
                    .padStart(2, '0')
                    .replace('NaN', '')
            )
            .join('')}`
    buttons.forEach(btn => {
        btn.addEventListener('click', function () {
            targetObj.needsUpdate = true
            targetObj2.needsUpdate = true
            // targetObj.material.envMap = null
            // targetObj.material.map = null
            color = rgba2hex(btn.style.backgroundColor)
            targetObj.material.color.set(color)
            targetObj2.material.color.set(color)
        })
    })
})

// anim
actions = []
let mixer

// arr
buttons = []
rings = []
modals = []
texts = []


// 버튼 객체 생성 & 위치 값 //
//btn01
const btnGeo01 = new THREE.SphereGeometry(3, 20, 20)
const btnMat01 = new THREE.MeshBasicMaterial({ color: 'black', opacity: 0.5, transparent: true })
const btn01 = new THREE.Mesh(btnGeo01, btnMat01)
btn01.position.set(50, 50, 10)
btn01.name = 'btn01'
buttons.push(btn01)
scene.add(btn01)
//btn02
const btn02 = new THREE.Mesh(btnGeo01, btnMat01)
btn02.position.set(-20, 20, 10)
btn02.g
btn02.name = 'btn02'
buttons.push(btn02)
scene.add(btn02)
//btn03
const btn03 = new THREE.Mesh(btnGeo01, btnMat01)
btn03.position.set(-50, 0, -20)
btn03.name = 'btn03'
buttons.push(btn03)
scene.add(btn03)
//btn04
const btn04 = new THREE.Mesh(btnGeo01, btnMat01)
btn04.position.set(30, -30, 0)
btn04.name = 'btn04'
buttons.push(btn04)
scene.add(btn04)

//ring01
const texture = new THREE.TextureLoader().load('./assets/img/ring02.png')
const ringGeo01 = new THREE.BufferGeometry()
ringGeo01.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3)) //new THREE.Vector3().toArray()
const ringMat01 = new THREE.PointsMaterial({ color: '#000', map: texture, transparent: true })
const ring01 = new THREE.Points(ringGeo01, ringMat01)
ring01.material.size = 30.0
ring01.material.opacity = 0.9
ring01.name = 'ring01'
gsap.to(ring01.material, { size: 40, opacity: 0, duration: 1.2 }).repeat(-1).repeatDelay(0.5)
rings.push(ring01)
btn01.add(ring01)
//ring02
const ring02 = new THREE.Points(ringGeo01, ringMat01)
ring02.material.size = 30.0
ring02.material.opacity = 0.9
ring02.name = 'ring02'
gsap.to(ring02.material, { size: 40, opacity: 0, duration: 1.2 }).repeat(-1).repeatDelay(0.5)
rings.push(ring02)
btn02.add(ring02)
//ring03
const ring03 = new THREE.Points(ringGeo01, ringMat01)
ring03.material.size = 30.0
ring03.material.opacity = 0.9
ring03.name = 'ring03'
gsap.to(ring03.material, { size: 40, opacity: 0, duration: 1.2 }).repeat(-1).repeatDelay(0.5)
rings.push(ring03)
btn03.add(ring03)
//ring04
const ring04 = new THREE.Points(ringGeo01, ringMat01)
ring04.material.size = 30.0
ring04.material.opacity = 0.9
ring04.name = 'ring04'
gsap.to(ring04.material, { size: 40, opacity: 0, duration: 1.2 }).repeat(-1).repeatDelay(0.5)
rings.push(ring04)
btn04.add(ring04)

const tt01 = new THREE.TextureLoader().load("./assets/img/text01.png");
const textGeo01 = new THREE.BufferGeometry()
textGeo01.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3))
const textMat01 = new THREE.PointsMaterial({ color: '#e1e1e1', map: tt01, transparent: true, })
const text01 = new THREE.Points(textGeo01, textMat01)
text01.position.set(50, 40, 10)
text01.material.size = 30
text01.material.opacity = 0.8
text01.name = 'text01'
texts.push(text01)
scene.add(text01)

const tt02 = new THREE.TextureLoader().load("./assets/img/text02.png");
const textMat02 = new THREE.PointsMaterial({ color: '#e1e1e1', map: tt02, transparent: true, })
const text02 = new THREE.Points(textGeo01, textMat02)
text02.position.set(-20, 10, 10)
text02.material.size = 30
text02.material.opacity = 0.8
text02.name = 'text02'
texts.push(text02)
scene.add(text02)

const tt03 = new THREE.TextureLoader().load("./assets/img/text04.png");
const textMat03 = new THREE.PointsMaterial({ color: '#e1e1e1', map: tt03, transparent: true, })
const text03 = new THREE.Points(textGeo01, textMat03)
text03.position.set(-50, -10, -20)
text03.material.size = 30
text03.material.opacity = 0.8
text03.name = 'text03'
texts.push(text03)
scene.add(text03)

const tt04 = new THREE.TextureLoader().load("./assets/img/text03.png");
const textMat04 = new THREE.PointsMaterial({ color: '#e1e1e1', map: tt04, transparent: true, })
const text04 = new THREE.Points(textGeo01, textMat04)
text04.position.set(30, -40, 0)
text04.material.size = 30
text04.material.opacity = 0.8
text04.name = 'text04'
texts.push(text04)
scene.add(text04)

//modal
let modal01 = document.querySelector('.modal01')
let modal02 = document.querySelector('.modal02')
let modal03 = document.querySelector('.modal03')
let modal04 = document.querySelector('.modal04')
modals.push(modal01)
modals.push(modal02)
modals.push(modal03)
modals.push(modal04)



//rayCaster
const rayCaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
addEventListener('click', rayCasterHandler)
addEventListener('touchend', rayCasterHandler)

//rayCasterHandler
function rayCasterHandler(e) {
    if (e.type === 'click') {
        mouse.x = (e.clientX / innerWidth) * 2 - 1
        mouse.y = (e.clientY / innerHeight) * -2 + 1
    } else if (e.type === 'touchend') {
        mouse.x = (e.changedTouches[0].clientX / innerWidth) * 2 - 1
        mouse.y = (e.changedTouches[0].clientY / innerHeight) * -2 + 1
    }
    rayCaster.setFromCamera(mouse, camera)
    const objects = rayCaster.intersectObjects(scene.children, true)
    objects.forEach(obj => {
        obj = obj.object
        if (obj.name === 'btn01') {
            gsap.to(camera.position, {
                x: 200,
                y: 0,
                z: 0,
                duration: 1.2,
                // callback
                onComplete: () => {
                    modal01.style.display = 'block'
                },
            })
            gsap.to(dirLight.position, {
                x: 50,
                y: 50,
                z: -100,
                duration: 1.2,
                // callback
                onComplete: () => {
                    modal01.style.display = 'block'
                },
            })
            hideButtons()
        } else if (obj.name === 'btn02') {
            gsap.to(camera.position, {
                x: -100,
                y: 0,
                z: 100,
                duration: 1.2,
                // callback
                onComplete: () => {
                    modal02.style.display = 'block'
                },
            })
            gsap.to(dirLight.position, {
                x: -150,
                y: 200,
                z: 200,
                duration: 1.2,
                // callback
                onComplete: () => {
                    modal02.style.display = 'block'
                },
            })
            hideButtons()
        } else if (obj.name === 'btn03') {
            gsap.to(camera.position, {
                // 0, 0.4, -0.6
                x: -100,
                y: 0,
                z: -100,
                duration: 1.2,
                // callback
                onComplete: () => {
                    modal03.style.display = 'block'
                },
            })
            gsap.to(dirLight.position, {
                x: 100,
                y: 200,
                z: -200,
                duration: 1.2,
                // callback
                onComplete: () => {
                    modal03.style.display = 'block'
                },
            })
            hideButtons()
        } else if (obj.name === 'btn04') {
            gsap.to(camera.position, {
                // 0, 0.4, -0.6
                x: 50,
                y: -50,
                z: 100,
                duration: 1.2,
                // callback
                onComplete: () => {
                    modal04.style.display = 'block'
                },
            })
            hideButtons()
        }
    })
}

//domEvents
const domEvents = new THREEx.DomEvents(camera, renderer.domElement)
buttons.forEach(btn => {
    domEvents.addEventListener(btn, 'mouseover', function (e) {
        document.body.style.cursor = 'pointer'
        // btn.material.color = new THREE.Color('#ffc8c8')
    })
})

//domEventsHandler
//back
modal01.addEventListener('click', function (e) {
    const close = this.querySelector('.close')
    if (e.target === this || e.target === close) {
        hideModals()
        showButtons()
        gsap.to(camera.position, {
            x: -150,
            y: 30,
            z: 150,
            duration: 1.2,
            // callback
            onComplete: () => {
                controls.enabled = true
            },
        })
        gsap.to(dirLight.position, {
            x: 100,
            y: 100,
            z: 100,
            duration: 1.2,
        })
        gsap.to(ring01.position, {
            x: 1000,
            y: 1000,
            z: 1000,
            duration: 1.2,
        })
    }
})
modal02.addEventListener('click', function (e) {
    const close = this.querySelector('.close')
    if (e.target === this || e.target === close) {
        hideModals()
        showButtons()
        gsap.to(camera.position, {
            x: -150,
            y: 30,
            z: 150,
            duration: 1.2,
            // callback
            onComplete: () => {
                controls.enabled = true
            },
        })
        gsap.to(dirLight.position, {
            x: 100,
            y: 100,
            z: 100,
            duration: 1.2,
        })
        gsap.to(ring02.position, {
            x: 1000,
            y: 1000,
            z: 1000,
            duration: 1.2,
        })
    }
})
modal03.addEventListener('click', function (e) {
    const close = this.querySelector('.close')
    if (e.target === this || e.target === close) {
        hideModals()
        showButtons()
        gsap.to(camera.position, {
            x: -150,
            y: 30,
            z: 150,
            duration: 1.2,
            // callback
            onComplete: () => {
                controls.enabled = true
            },
        })
        gsap.to(dirLight.position, {
            x: 100,
            y: 100,
            z: 100,
            duration: 1.2,
        })
        gsap.to(ring03.position, {
            x: 1000,
            y: 1000,
            z: 1000,
            duration: 1.2,
        })
    }
})
modal04.addEventListener('click', function (e) {
    const close = this.querySelector('.close')
    if (e.target === this || e.target === close) {
        hideModals()
        showButtons()
        gsap.to(camera.position, {
            x: -150,
            y: 30,
            z: 150,
            duration: 1.2,
            // callback
            onComplete: () => {
                controls.enabled = true
            },
        })
        gsap.to(dirLight.position, {
            x: 100,
            y: 100,
            z: 100,
            duration: 1.2,
        })
        gsap.to(ring04.position, {
            x: 1000,
            y: 1000,
            z: 1000,
            duration: 1.2,
        })
    }
})
//cursor
modals.forEach(modal => {
    modal.addEventListener('mouseover', function (e) {
        if (e.target === modal) document.body.style.cursor = 'pointer'
    })
    modal.addEventListener('mouseout', function (e) {
        if (e.target === modal) document.body.style.cursor = 'default'
    })
})

//functions
function hideButtons() {
    controls.enabled = false
    buttons.forEach(btn => { scene.remove(btn) })
    texts.forEach(text => { scene.remove(text) })
}
function showButtons() {
    buttons.forEach(btn => { scene.add(btn) })
    texts.forEach(text => { scene.add(text) })
}
function hideModals() {
    modals.forEach(modal => (modal.style.display = 'none'))
}
//update
function update(object) {
    camera.lookAt(0, 0.35, 0)
    renderer.render(scene, camera)
    requestAnimationFrame(update)
}
update()
// three.js 끝


// dom event
const boxOverlay = document.querySelector('.box_overlay');
const box = document.querySelector('.box');
const animArr = [];
animArr.push(boxOverlay, box);
window.addEventListener('load', () => {
    setTimeout(() => {
        animArr.forEach(el => {
            el.classList.add('remove');
        })
    }, 2500)
})
const overlay = document.querySelector('.overlay');
const chatBox = document.querySelector('.chat-box');
const menuArr = [];
menuArr.push(overlay, chatBox);
document.querySelector('.menu').addEventListener('click', () => {
    menuArr.forEach( el => {
        el.classList.toggle('active');
        overlay.addEventListener('click', () => {
            el.classList.remove('active');
        })
    })
})



