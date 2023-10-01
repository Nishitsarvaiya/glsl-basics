import { Color, PCFSoftShadowMap, PerspectiveCamera, Scene, WebGLRenderTarget, WebGLRenderer } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import TickManager from './tick-manager';

let canvas, renderer, camera, scene, composer, controls, renderWidth, renderHeight, renderAspectRatio;
const renderTickManager = new TickManager();

export const initEngine = async (container) => {
	renderWidth = window.innerWidth;
	renderHeight = window.innerHeight;
	renderAspectRatio = renderWidth / renderHeight;

	renderer = new WebGLRenderer({ antialias: true });
	renderer.setSize(renderWidth, renderHeight);
	canvas = renderer.domElement;
	container.append(canvas);

	// shadow
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = PCFSoftShadowMap;

	camera = new PerspectiveCamera(75, renderAspectRatio, 0.1, 100);
	camera.position.set(0, 0, 2);

	scene = new Scene();
	// scene.background = new Color('#ffffff');

	const target = new WebGLRenderTarget(renderWidth, renderHeight, { samples: 8 });
	composer = new EffectComposer(renderer, target);
	const renderPass = new RenderPass(scene, camera);
	composer.addPass(renderPass);

	controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;

	window.addEventListener(
		'resize',
		() => {
			renderWidth = window.innerWidth;
			renderHeight = window.innerHeight;
			renderAspectRatio = renderWidth / renderHeight;

			renderer.setPixelRatio(window.devicePixelRatio * 1.5);

			camera.aspect = renderAspectRatio;
			camera.updateProjectionMatrix();

			renderer.setSize(renderWidth, renderHeight);
			composer.setSize(renderWidth, renderHeight);
		},
		false
	);

	renderTickManager.startLoop();
};

export const useRenderer = () => renderer;

export const useRenderSize = () => ({ width: renderWidth, height: renderHeight });

export const useScene = () => scene;

export const useCamera = () => camera;

export const useControls = () => controls;

export const useStats = () => stats;

export const useComposer = () => composer;

export const useGui = () => gui;

export const addPass = (pass) => {
	composer.addPass(pass);
};

export const useTick = (fn) => {
	if (renderTickManager) {
		const _tick = (e) => {
			fn(e.data);
		};
		renderTickManager.addEventListener('tick', _tick);
	}
};
