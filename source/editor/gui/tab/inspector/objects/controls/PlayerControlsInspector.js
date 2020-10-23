import {ChangeAction} from "../../../../../history/action/ChangeAction.js";
import {ObjectInspector} from "../ObjectInspector.js";
import {Editor} from "../../../../../Editor.js";
import {NumberBox} from "../../../../../components/input/NumberBox.js";

function PlayerControlsInspector(parent, object)
{
	ObjectInspector.call(this, parent, object);

	var self = this;

	// Distance
	this.form.addText('Acceleration');
	this.acceleration = new NumberBox(this.form);
	this.acceleration.size.set(60, 18);
	this.acceleration.setStep(0.1);
	this.acceleration.setRange(0, Number.MAX_SAFE_INTEGER);
	this.acceleration.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "acceleration", self.acceleration.getValue()));
	});
	this.form.add(this.acceleration);
	this.form.nextRow();
}

PlayerControlsInspector.prototype = Object.create(ObjectInspector.prototype);

PlayerControlsInspector.prototype.updateInspector = function()
{
	ObjectInspector.prototype.updateInspector.call(this);
	
	this.acceleration.setValue(this.object.acceleration);
};

export {PlayerControlsInspector};
