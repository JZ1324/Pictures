window.addEventListener('DOMContentLoaded', init);

function init() {
    // Create a scene
    const scene = new THREE.Scene();

    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create a renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('globe').appendChild(renderer.domElement);

    // Create a sphere geometry
    const geometry = new THREE.SphereGeometry(2, 32, 32);

    // Load a texture for the globe
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('earth_texture.jpg');

    // Create a material with the texture
    const material = new THREE.MeshBasicMaterial({ map: texture });

    // Create a mesh with the geometry and material
    const globe = new THREE.Mesh(geometry, material);

    // Add the mesh to the scene
    scene.add(globe);

    // Add event listeners for interaction
    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    // Render the scene
    function render() {
        requestAnimationFrame(render);
        globe.rotation.y += 0.005;
        renderer.render(scene, camera);
    }

    render();

    // Handle window resize
    function handleResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Variables for mouse interaction
    let isDragging = false;
    let previousMousePosition = {
        x: 0,
        y: 0
    };

    // Handle mouse down event
    function handleMouseDown(event) {
        isDragging = true;
        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }

    // Handle mouse up event
    function handleMouseUp() {
        isDragging = false;
    }

    // Handle mouse move event
    function handleMouseMove(event) {
        if (!isDragging) {
            return;
        }

        const { x, y } = event;

        const deltaMove = {
            x: x - previousMousePosition.x,
            y: y - previousMousePosition.y
        };

        const deltaRotationQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(
                toRadians(deltaMove.y * 1),
                toRadians(deltaMove.x * 1),
                0,
                'XYZ'
            ));

        globe.quaternion.multiplyQuaternions(deltaRotationQuaternion, globe.quaternion);

        previousMousePosition = { x, y };
    }

    // Helper function to convert degrees to radians
    function toRadians(angle) {
        return angle * (Math.PI / 180);
    }
}
