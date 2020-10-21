import {Color, PerspectiveCamera, Scene, Object3D, PointLight, AmbientLight, Mesh, FrontSide, BackSide, DoubleSide, NoBlending, NormalBlending, AdditiveBlending, SubtractiveBlending, MultiplyBlending} from "three";
import {Locale} from "../../../locale/LocaleManager.js";
import {Sky} from "../../../../core/objects/misc/Sky.js";
import {Mouse} from "../../../../core/input/Mouse.js";
import {ChangeAction} from "../../../history/action/ChangeAction.js";
import {CodeEditor} from "../code/CodeEditor.js";
import {Global} from "../../../Global.js";
import {Editor} from "../../../Editor.js";
import {TabGroup} from "../../../components/tabs/TabGroup.js";
import {TabComponent} from "../../../components/tabs/TabComponent.js";
import {TableForm} from "../../../components/TableForm.js";
import {RendererCanvas} from "../../../components/RendererCanvas.js";
import {TextBox} from "../../../components/input/TextBox.js";
import {DropdownList} from "../../../components/input/DropdownList.js";
import {CheckBox} from "../../../components/input/CheckBox.js";
import {DualDivision} from "../../../components/containers/DualDivision.js";
import {DualContainer} from "../../../components/containers/DualContainer.js";
import {MaterialEditor} from "./MaterialEditor.js";
import { TextureForm } from "../../../components/input/TextureForm.js";
import { ColorChooser } from "../../../components/input/ColorChooser.js";


function ShaderMaterialEditor(parent, closeable, container, index)
{
	TabComponent.call(this, parent, closeable, container, index, Locale.material, Global.FILE_PATH + "icons/misc/material.png");

	var self = this;

	// Preview configuration
	this.previewForm = new TableForm();
	this.previewForm.setAutoSize(false);
	this.previewForm.addText(Locale.configuration);
	this.previewForm.nextRow();
	
	// Canvas
	this.canvas = new RendererCanvas();
	this.canvas.setOnResize(function(x, y)
	{
		self.camera.aspect = x / y;
		self.camera.updateProjectionMatrix();
	});

	// Mouse
	this.mouse = new Mouse(window, true);
	this.mouse.setCanvas(this.canvas.element);

	// Preview division
	this.preview = new DualContainer();
	this.preview.orientation = DualDivision.VERTICAL;
	this.preview.tabPosition = 0.8;
	this.preview.tabPositionMin = 0.05;
	this.preview.tabPositionMax = 0.95;
	this.preview.attachA(this.canvas);
	this.preview.attachB(this.previewForm);

	// Tab container
	this.tab = new TabGroup();
	this.tab.element.style.backgroundColor = "var(--bar-color)";
	this.tab.buttonSize.set(150, 25);

	// Main container
	this.main = new DualContainer(this);
	this.main.tabPosition = 0.5;
	this.main.tabPositionMin = 0.05;
	this.main.tabPositionMax = 0.95;
	this.main.attachA(this.preview);
	this.main.attachB(this.tab);

	// Material UI File element
	this.asset = null;

	// Attached material
	this.material = null;

	// Material camera
	this.camera = new PerspectiveCamera(80, this.canvas.size.x/this.canvas.size.y);
	this.camera.position.set(0, 0, 2.5);
	
	// Scene
	this.scene = new Scene();
	
	// Interactive object
	this.interactive = new Object3D();
	this.scene.add(this.interactive);
	
	// Scene
	this.sky = new Sky();
	this.sky.visible = false;
	this.scene.add(this.sky);

	this.pointLight = new PointLight(0x777777);
	this.pointLight.position.set(-3, 0, 3);
	this.pointLight.visible = false;
	this.scene.add(this.pointLight);
	
	this.ambientLight = new AmbientLight(0x555555);
	this.ambientLight.visible = false;
	this.scene.add(this.ambientLight);

	// Mesh
	this.mesh = new Mesh(MaterialEditor.geometries[0][1], null);
	this.interactive.add(this.mesh);
	
	// Test model
	this.previewForm.addText(Locale.geometry);
	this.testModel = new DropdownList(this.previewForm);
	this.testModel.size.set(100, 18);
	for (var i = 0; i < MaterialEditor.geometries.length; i++)
	{
		this.testModel.addValue(MaterialEditor.geometries[i][0], i);
	}
	this.testModel.setOnChange(function()
	{
		var value = self.testModel.getSelectedIndex();
		self.mesh.geometry = MaterialEditor.geometries[value][1];
	});
	this.previewForm.add(this.testModel);
	this.previewForm.nextRow();

	// Sky
	this.previewForm.addText(Locale.sky);
	this.skyEnabled = new CheckBox(this.previewForm);
	this.skyEnabled.size.set(18, 18);
	this.skyEnabled.setValue(this.sky.visible);
	this.skyEnabled.setOnChange(function()
	{
		self.sky.visible = self.skyEnabled.getValue();
	});
	this.previewForm.add(this.skyEnabled);
	this.previewForm.nextRow();

	// Point Light
	this.previewForm.addText(Locale.pointLight);
	this.lightEnabled = new CheckBox(this.previewForm);
	this.lightEnabled.size.set(18, 18);
	this.lightEnabled.setValue(this.pointLight.visible);
	this.lightEnabled.setOnChange(function()
	{
		self.pointLight.visible = self.lightEnabled.getValue();
	});
	this.previewForm.add(this.lightEnabled);
	this.previewForm.nextRow();

	// Ambient Light
	this.previewForm.addText(Locale.ambientLight);
	this.ambientLightEnabled = new CheckBox(this.previewForm);
	this.ambientLightEnabled.size.set(18, 18);
	this.ambientLightEnabled.setValue(this.ambientLight.visible);
	this.ambientLightEnabled.setOnChange(function()
	{
		self.ambientLight.visible = self.ambientLightEnabled.getValue();
	});
	this.previewForm.add(this.ambientLightEnabled);
	this.previewForm.nextRow();

	// General
	this.general = this.tab.addTab(TabComponent, false);
	this.general.setIcon(Global.FILE_PATH + "icons/misc/material.png");
	this.general.setName(Locale.material);

	this.form = new TableForm(this.general);
	this.form.setAutoSize(false);

	// Name
	this.form.addText(Locale.name);
	this.name = new TextBox(this.form);
	this.name.size.set(200, 18);
	this.name.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "name", self.name.getText()));
		Editor.updateObjectsViewsGUI();
	});
	this.form.add(this.name);
	this.form.nextRow();

	// Side
	this.form.addText(Locale.side);
	this.side = new DropdownList(this.form);
	this.side.position.set(100, 85);
	this.side.size.set(150, 18);
	this.side.addValue(Locale.front, FrontSide);
	this.side.addValue(Locale.back, BackSide);
	this.side.addValue(Locale.double, DoubleSide);
	this.side.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "side", self.side.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.side);
	this.form.nextRow();

	// Test depth
	this.form.addText(Locale.depthTest);
	this.depthTest = new CheckBox(this.form);
	this.depthTest.size.set(18, 18);
	this.depthTest.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "depthTest", self.depthTest.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.depthTest);
	this.form.nextRow();
	
	// Write depth
	this.form.addText(Locale.depthWrite);
	this.depthWrite = new CheckBox(this.form);
	this.depthWrite.size.set(18, 18);
	this.depthWrite.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "depthWrite", self.depthWrite.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.depthWrite);
	this.form.nextRow();

	// Transparent
	this.form.addText(Locale.transparent);
	this.transparent = new CheckBox(this.form);
	this.transparent.size.set(18, 18);
	this.transparent.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "transparent", self.transparent.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.transparent);
	this.form.nextRow();
	
	// Blending mode
	this.form.addText(Locale.blendingMode);
	this.blending = new DropdownList(this.form);
	this.blending.position.set(100, 85);
	this.blending.size.set(100, 18);
	this.blending.addValue(Locale.none, NoBlending);
	this.blending.addValue(Locale.normal, NormalBlending);
	this.blending.addValue(Locale.additive, AdditiveBlending);
	this.blending.addValue(Locale.subtractive, SubtractiveBlending);
	this.blending.addValue(Locale.multiply, MultiplyBlending);
	this.blending.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "blending", self.blending.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.blending);
	this.form.nextRow();

	// Wireframe
	this.form.addText(Locale.wireframe);
	this.wireframe = new CheckBox(this.form);
	this.wireframe.size.set(18, 18);
	this.wireframe.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "wireframe", self.wireframe.getValue()));
	});
	this.form.add(this.wireframe);
	this.form.nextRow();

	// Color
	this.form.addText(Locale.color);
	this.color = new ColorChooser(this.form);
	this.color.size.set(100, 18);
	this.color.setOnChange(function()
	{
		console.log(self.material);
		console.log(self.color.getValueHex());
		
		self.material.uniforms['color'].value = new Color(self.color.getValueHex());
		console.log(self.material);

		self.material.needsUpdate = true;
	});
	this.form.add(this.color);
	this.form.nextRow();
	
	// Texture map
	this.form.addText(Locale.textureMap);
	this.map = new TextureForm(this.form);
	this.map.size.set(0, 100);
	this.map.setOnChange(function()
	{
		self.material.uniforms['map'].value = self.map.getValue();
		// Editor.addAction(new ChangeAction(self.material, "map", self.map.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.map);
	this.form.nextRow();

	// Fragment tab
	this.fragmentShader = this.tab.addTab(CodeEditor, false);
	this.fragmentShader.setName(Locale.fragment);
	this.fragmentShader.setLanguage("glsl");
	this.fragmentShader.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "fragmentShader", self.fragmentShader.getText()));
		self.material.needsUpdate = true;
	});

	// Vertex tab
	this.vertexShader = this.tab.addTab(CodeEditor, false);
	this.vertexShader.setName(Locale.vertex);
	this.vertexShader.setLanguage("glsl");
	this.vertexShader.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "vertexShader", self.vertexShader.getText()));
		self.material.needsUpdate = true;
	});
}

ShaderMaterialEditor.prototype = Object.create(MaterialEditor.prototype);

ShaderMaterialEditor.prototype.attach = function(material, asset)
{
	this.mesh.material = material;

	if (asset !== undefined)
	{
		this.asset = asset;
	}

	this.material = material;
	this.updateMetadata();

	// Base
	this.name.setText(material.name);
	this.side.setValue(material.side);
	this.depthTest.setValue(material.depthTest);
	this.depthWrite.setValue(material.depthWrite);
	this.transparent.setValue(material.transparent);
	this.blending.setValue(material.blending);	
	this.wireframe.setValue(material.wireframe);

	// Shader
	this.fragmentShader.setText(material.fragmentShader);
	this.vertexShader.setText(material.vertexShader);

	//
	this.color.setValue(material.uniforms['color'].r, material.uniforms['color'].g, material.uniforms['color'].b);
	this.map.setValue(material.map);
};

ShaderMaterialEditor.prototype.updateSize = function()
{
	TabComponent.prototype.updateSize.call(this);

	this.main.size.copy(this.size);
	this.main.updateInterface();

	this.form.size.copy(this.general.size);
	this.form.updateInterface();
};
export {ShaderMaterialEditor};
