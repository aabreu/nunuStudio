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
