import {Locale} from "../../../../locale/LocaleManager.js";
import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {Editor} from "../../../../Editor.js";
import {TableForm} from "../../../../components/TableForm.js";
import {CheckBox} from "../../../../components/input/CheckBox.js";
import {ButtonText} from "../../../../components/buttons/ButtonText.js";
import { NumberBox } from "../../../../components/input/NumberBox.js";
import { Slider } from "../../../../components/input/Slider.js";
import { ColorChooser } from "../../../../components/input/ColorChooser.js";

function PassNode(parent, name)
{
	TableForm.call(this, parent);

	this.element.style.overflow = "hidden"; 

	this.name = name;
	
	this.defaultTextWidth = 60;
	this.position.set(10, 5);
	this.spacing.set(5, 5);

	// Pass
	this.pass = null;
	this.composer = null;
	this.editor = null;

	// Render pass
	this.addText(name !== undefined ? name : "Pass Node");
	this.nextRow();

	var self = this;

	// Enabled
	this.addText(Locale.enabled);
	this.enabled = new CheckBox(this);
	this.enabled.size.set(18, 18);
	this.enabled.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.pass, "enabled", self.enabled.getValue()));
	});
	this.add(this.enabled);
	this.nextRow();

	// Clear
	this.addText(Locale.clear);
	this.clear = new CheckBox(this);
	this.clear.size.set(18, 18);
	this.clear.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.pass, "clear", self.clear.getValue()));
	});
	this.add(this.clear);
	this.nextRow();

	// Render to screen
	this.addText("Output");
	this.renderToScreen = new CheckBox(this);
	this.renderToScreen.size.set(18, 18);
	this.renderToScreen.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.pass, "renderToScreen", self.renderToScreen.getValue()));
	});
	this.add(this.renderToScreen);
	this.nextRow();

	// Up
	this.up = new ButtonText(this);
	this.up.size.set(50, 18);
	this.up.setText("Up");
	this.up.setOnClick(function()
	{
		self.composer.moveBack(self.pass);
		self.editor.updatePostNodes();
	});

	// Down
	this.down = new ButtonText(this);
	this.down.size.set(50, 18);
	this.down.setText("Down");
	this.down.setOnClick(function()
	{
		self.composer.moveForward(self.pass);
		self.editor.updatePostNodes();
	});

	// Delete
	this.delete = new ButtonText(this);
	this.delete.size.set(70, 18);
	this.delete.setText(Locale.delete);
	this.delete.setOnClick(function()
	{
		self.composer.removePass(self.pass);
		self.editor.updatePostNodes();
	});

	// custom pass parameters
	console.log('settings for', name);
	switch(name){
		case 'UnrealBloom':
			this.addText("Strength");
			this.strength = new NumberBox(this);
			this.strength.size.set(60, 18);
			this.strength.setOnChange(function()
			{
				Editor.addAction(new ChangeAction(self.pass, "strength", self.strength.getValue()));
			});
			this.add(this.strength);
			this.nextRow();

			this.addText(Locale.radius);
			this.radius = new NumberBox(this);
			this.radius.size.set(60, 18);
			this.radius.setOnChange(function()
			{
				Editor.addAction(new ChangeAction(self.pass, "radius", self.radius.getValue()));
			});
			this.add(this.radius);
			this.nextRow();

			this.addText("Threshold");
			this.threshold = new NumberBox(this);
			this.threshold.size.set(60, 18);
			this.threshold.setOnChange(function()
			{
				Editor.addAction(new ChangeAction(self.pass, "threshold", self.threshold.getValue()));
			});
			this.add(this.threshold);
			this.nextRow();

			this.addText(Locale.smooth);
			this.smooth = new NumberBox(this);
			this.smooth.size.set(60, 18);
			this.smooth.setOnChange(function()
			{
				Editor.addAction(new ChangeAction(self.pass, "smooth", self.smooth.getValue()));
			});
			this.add(this.smooth);
			this.nextRow();
			break;
		case 'HueSaturation':
			this.addText("Hue");
			this.hue = new Slider(this);
			this.hue.size.set(80, 18);
			this.hue.setStep(0.05);
			this.hue.setRange(-1, 1);
			this.hue.setOnChange(function()
			{
				Editor.addAction(new ChangeAction(self.pass, "hue", self.hue.getValue()));
			});
			this.add(this.hue);
			this.nextRow();

			this.addText("Saturation");
			this.saturation = new Slider(this);
			this.saturation.size.set(80, 18);
			this.saturation.setStep(0.05);
			this.saturation.setRange(-1, 1);
			this.saturation.setOnChange(function()
			{
				Editor.addAction(new ChangeAction(self.pass, "saturation", self.saturation.getValue()));
			});
			this.add(this.saturation);
			this.nextRow();
			break;
		case 'Colorify':
			this.addText(Locale.color);
			this.color = new ColorChooser(this);
			this.color.size.set(80, 18);
			this.color.setOnChange(function()
			{
				var value = self.color.getValue();

				var color = self.pass.color.clone();
				color.setRGB(value.r, value.g, value.b);

				Editor.addAction(new ChangeAction(self.pass, "color", color));
			});
			this.add(this.color);
			this.nextRow();
			break;
		case 'Bokeh':
			this.addText("Aperture");
			this.aperture = new Slider(this);
			this.aperture.size.set(0, 18);
			this.aperture.setRange(0, 1e-3);
			this.aperture.setStep(1e-5);
			this.aperture.setOnChange(function()
			{
				Editor.addAction(new ChangeAction(self.pass, "aperture", self.aperture.getValue()));
			});
			this.add(this.aperture);
			this.nextRow();

			this.addText(Locale.focus);
			this.focus = new NumberBox(this);
			this.focus.size.set(0, 18);
			this.focus.setStep(1e-4);
			this.focus.setOnChange(function()
			{
				Editor.addAction(new ChangeAction(self.pass, "focus", self.focus.getValue()));
			});
			this.add(this.focus);
			this.nextRow();

			this.addText("Max Blur");
			this.maxblur = new Slider(this);
			this.maxblur.size.set(0, 18);
			this.maxblur.setRange(0, 3e-1);
			this.maxblur.setStep(1e-5);
			this.maxblur.setOnChange(function()
			{
				Editor.addAction(new ChangeAction(self.pass, "maxblur", self.maxblur.getValue()));
			});
			this.add(this.maxblur);
			this.nextRow();
			break;
		case 'Film':
			this.addText("Grayscale");
			this.grayscale = new CheckBox(this);
			this.grayscale.size.set(18, 18);
			this.grayscale.setOnChange(function()
			{
				Editor.addAction(new ChangeAction(self.pass, "grayscale", self.grayscale.getValue()));
			});
			this.add(this.grayscale);
			this.nextRow();
		
			this.addText("Noise");
			this.noiseIntensity = new NumberBox(this);
			this.noiseIntensity.size.set(60, 18);
			this.noiseIntensity.setOnChange(function()
			{
				Editor.addAction(new ChangeAction(self.pass, "noiseIntensity", self.noiseIntensity.getValue()));
			});
			this.add(this.noiseIntensity);
			this.nextRow();
		
			this.addText(Locale.intensity);
			this.scanlinesIntensity = new NumberBox(this);
			this.scanlinesIntensity.size.set(60, 18);
			this.scanlinesIntensity.setOnChange(function()
			{
				Editor.addAction(new ChangeAction(self.pass, "scanlinesIntensity", self.scanlinesIntensity.getValue()));
			});
			this.add(this.scanlinesIntensity);
			this.nextRow();
		
			this.addText("Scanlines");
			this.scanlinesCount = new NumberBox(this);
			this.scanlinesCount.size.set(60, 18);
			this.scanlinesCount.setOnChange(function()
			{
				Editor.addAction(new ChangeAction(self.pass, "scanlinesCount", self.scanlinesCount.getValue()));
			});
			this.add(this.scanlinesCount);
			this.nextRow();
			break;
		case 'SSAO':
			this.addText("Only AO");
			this.onlyAO = new CheckBox(this);
			this.onlyAO.size.set(18, 18);
			this.onlyAO.setOnChange(function()
			{
				Editor.addAction(new ChangeAction(self.pass, "onlyAO", self.onlyAO.getValue()));
			});
			this.add(this.onlyAO);
			this.nextRow();

			this.addText(Locale.radius);
			this.radius = new NumberBox(this);
			this.radius.size.set(60, 18);
			this.radius.setOnChange(function()
			{
				Editor.addAction(new ChangeAction(self.pass, "radius", self.radius.getValue()));
			});
			this.add(this.radius);
			this.nextRow();

			this.addText("Clamp");
			this.aoClamp = new NumberBox(this);
			this.aoClamp.size.set(60, 18);
			this.aoClamp.setOnChange(function()
			{
				Editor.addAction(new ChangeAction(self.pass, "aoClamp", self.aoClamp.getValue()));
			});
			this.add(this.aoClamp);
			this.nextRow();

			this.addText("Lum. Influence");
			this.lumInfluence = new NumberBox(this);
			this.lumInfluence.size.set(60, 18);
			this.lumInfluence.setOnChange(function()
			{
				Editor.addAction(new ChangeAction(self.pass, "lumInfluence", self.lumInfluence.getValue()));
			});
			this.add(this.lumInfluence);
			this.nextRow();
			break;
		case 'SSAONOH':
			this.addText(Locale.kernelRadius);
			this.kernelRadius = new NumberBox(this);
			this.kernelRadius.size.set(0, 18);
			this.kernelRadius.setStep(1.0);
			this.kernelRadius.setOnChange(function()
			{
				Editor.addAction(new ChangeAction(self.pass, "kernelRadius", self.kernelRadius.getValue()));
			});
			this.add(this.kernelRadius);
			this.nextRow();
		
			this.addText(Locale.kernelSize);
			this.kernelSize = new NumberBox(this);
			this.kernelSize.size.set(0, 18);
			this.kernelSize.setStep(1.0);
			this.kernelSize.setOnChange(function()
			{
				Editor.addAction(new ChangeAction(self.pass, "kernelSize", self.kernelSize.getValue()));
			});
			this.add(this.kernelSize);
			this.nextRow();
		
			this.addText(Locale.minDistance);
			this.minDistance = new NumberBox(this);
			this.minDistance.size.set(0, 18);
			this.minDistance.setOnChange(function()
			{
				Editor.addAction(new ChangeAction(self.pass, "minDistance", self.minDistance.getValue()));
			});
			this.add(this.minDistance);
			this.nextRow();
		
			this.addText(Locale.maxDistance);
			this.maxDistance = new NumberBox(this);
			this.maxDistance.size.set(0, 18);
			this.maxDistance.setOnChange(function()
			{
				Editor.addAction(new ChangeAction(self.pass, "maxDistance", self.maxDistance.getValue()));
			});
			this.add(this.maxDistance);
			this.nextRow();
		break;
	}

}

PassNode.prototype = Object.create(TableForm.prototype);

PassNode.passes = {};

PassNode.createPass = function(element, type)
{
	if (PassNode.passes[type] !== undefined)
	{
		return new PassNode.passes[type](element);
	}

	return new PassNode(element, type);
};

PassNode.registerPass = function(type, Constructor)
{
	PassNode.passes[type] = Constructor;
};

PassNode.prototype.setPass = function(pass)
{
	this.pass = pass;

	this.enabled.setValue(pass.enabled);
	this.clear.setValue(pass.clear);
	this.renderToScreen.setValue(pass.renderToScreen);

	switch(this.name){
		case 'UnrealBloom':
			this.strength.setValue(pass.strength);
			this.radius.setValue(pass.radius);
			this.threshold.setValue(pass.threshold);
			this.smooth.setValue(pass.smooth);
		break;
		case 'HueSaturation':
			this.hue.setValue(pass.hue);
			this.saturation.setValue(pass.saturation);
		break;
		case 'Colorify':
			this.color.setValue(this.pass.color.r, this.pass.color.g, this.pass.color.b);
		break;
		case 'Bokeh':
			this.aperture.setValue(pass.aperture);
			this.focus.setValue(pass.focus);
			this.maxblur.setValue(pass.maxblur);
			break;
		case 'Film':
			this.grayscale.setValue(pass.grayscale);
			this.noiseIntensity.setValue(pass.noiseIntensity);
			this.scanlinesIntensity.setValue(pass.scanlinesIntensity);
			this.scanlinesCount.setValue(pass.scanlinesCount);
			break;
		case 'SSAO':
			this.radius.setValue(pass.radius);
			this.onlyAO.setValue(pass.onlyAO);
			this.aoClamp.setValue(pass.aoClamp);
			this.lumInfluence.setValue(pass.lumInfluence);
			break;
		case 'SSAONOH':
			this.kernelRadius.setValue(pass.kernelRadius);
			this.minDistance.setValue(pass.minDistance);
			this.maxDistance.setValue(pass.maxDistance);
			this.kernelSize.setValue(pass.kernelSize);
		break;
	}
};

PassNode.prototype.setComposer = function(composer)
{
	this.composer = composer;
};

PassNode.prototype.setEditor = function(editor)
{
	this.editor = editor;

	this.add(this.up);
	this.add(this.down);
	this.add(this.delete);
};

export {PassNode};
