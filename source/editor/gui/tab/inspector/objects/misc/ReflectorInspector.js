import { ColorChooser } from "../../../../../components/input/ColorChooser.js";
import { Editor } from "../../../../../Editor.js";
import { ChangeAction } from "../../../../../history/action/ChangeAction.js";
import { Locale } from "../../../../../locale/LocaleManager.js";
import {DrawableInspector} from "../DrawableInspector.js";
import {Color} from "three";

function ReflectorInspector(parent, object)
{
    DrawableInspector.call(this, parent, object);
    
    var self = this;

    // Color
	this.form.addText(Locale.color);
	this.color = new ColorChooser(this.form);
	this.color.size.set(80, 18);
	this.color.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "color", new Color(self.color.getValueHex())));
	});
	this.form.add(this.color);
	this.form.nextRow();
}

ReflectorInspector.prototype = Object.create(DrawableInspector.prototype);

ReflectorInspector.prototype.updateInspector = function()
{
    DrawableInspector.prototype.updateInspector.call(this);
    this.color.setValue(this.object.color.r, this.object.color.g, this.object.color.b);
};

export {ReflectorInspector};
