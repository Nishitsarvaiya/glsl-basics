import { AmbientLight, DirectionalLight, IcosahedronGeometry, Mesh, MeshStandardMaterial, Vector2 } from 'three';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { addPass, useCamera, useRenderSize, useScene, useTick } from './modules/init';
import fragmentMain from './shaders/fragment_main.glsl';
import fragmentPars from './shaders/fragment_pars.glsl';
import vertexMain from './shaders/vertex_main.glsl';
import vertexPars from './shaders/vertex_pars.glsl';

const initApp = () => {
	const scene = useScene();
	const camera = useCamera();
	const { width, height } = useRenderSize();

	// Lights
	const dirLight = new DirectionalLight('#526cff', 0.75);
	dirLight.position.set(2, 2, 2);
	const ambientLight = new AmbientLight('#4255ff', 0.5);
	scene.add(dirLight, ambientLight);

	const geometry = new IcosahedronGeometry(1, 200);
	const material = new MeshStandardMaterial({
		onBeforeCompile: (shader) => {
			material.userData.shader = shader;

			shader.uniforms.uTime = { value: 0 };

			const parsVertexString = /* glsl */ `#include <displacementmap_pars_vertex>`;
			shader.vertexShader = shader.vertexShader.replace(parsVertexString, parsVertexString + '\n' + vertexPars);

			const mainVertexString = /* glsl */ `#include <displacementmap_vertex>`;
			shader.vertexShader = shader.vertexShader.replace(mainVertexString, mainVertexString + '\n' + vertexMain);

			const mainFragmentString = /* glsl */ `#include <normal_fragment_maps>`;
			const parsFragmentString = /* glsl */ `#include <bumpmap_pars_fragment>`;
			shader.fragmentShader = shader.fragmentShader.replace(parsFragmentString, parsFragmentString + '\n' + fragmentPars);
			shader.fragmentShader = shader.fragmentShader.replace(mainFragmentString, mainFragmentString + '\n' + fragmentMain);
		},
	});
	const ico = new Mesh(geometry, material);
	scene.add(ico);

	// postprocessing
	addPass(new UnrealBloomPass(new Vector2(width, height), 0.7, 0.4, 0.4));

	useTick(({ timestamp }) => {
		const time = timestamp * 0.0001;
		material.userData.shader.uniforms.uTime.value = time;
	});
};

export default initApp;
