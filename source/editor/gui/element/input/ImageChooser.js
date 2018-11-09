"use strict";

function ImageChooser(parent)
{
	Element.call(this, parent, "div");

	//Image
	this.img = document.createElement("img");
	this.img.style.visibility = "inherit";
	this.img.style.position = "absolute";
	this.img.style.borderStyle = "none";
	this.img.style.left = "0px";
	this.img.style.top = "0px";
	this.img.style.width = "100%";
	this.img.style.height = "100%";
	this.img.style.objectFit = "contain";
	this.img.style.backgroundImage = "url(\"" + Editor.filePath + "alpha.png\")";
	this.img.style.backgroundRepeat = "repeat";
	this.img.style.backgroundSize = "120px 120px";
	this.element.appendChild(this.img);

	//Value
	this.value = null;

	var self = this;

	this.element.ondragover = Element.preventDefault;
	this.element.ondragstart = Element.preventDefault;

	//On drop get file dropped
	this.element.ondrop = function(event)
	{
		event.preventDefault();

		if(event.dataTransfer.files.length > 0)
		{
			var file = event.dataTransfer.files[0];

			if(Image.fileIsImage(file))
			{
				readImageFile(file);
			}
		}
		else
		{
			var uuid = event.dataTransfer.getData("uuid");
			var value = DragBuffer.get(uuid);

			if(value instanceof Image)
			{
				self.setValue(value);
				self.onChange(value);
			}
			else
			{
				Editor.alert("Only images accepted");
			}
		}
	};

	//Onclick select image file
	this.element.onclick = function()
	{
		if(self.onChange !== null)
		{
			FileSystem.chooseFile(function(files)
			{
				if(files.length > 0)
				{
					readImageFile(files[0]);
				}
			}, "image/*, .tga");
		}
	};

	var readImageFile = function(file)
	{
		var reader = new FileReader();
		reader.onload = function()
		{
			self.setValue(new Image(reader.result));
			self.onChange(self.value);
		};
		reader.readAsDataURL(file);
	};

	//onChange callback
	this.onChange = null;

	//Attributes
	this.size.set(100, 100);
}

ImageChooser.prototype = Object.create(Element.prototype);

//Set onChange callback
ImageChooser.prototype.setOnChange = function(onChange)
{
	this.onChange = onChange;
	this.img.style.cursor = "pointer";
};

//Set image URL
ImageChooser.prototype.setValue = function(image)
{
	this.value = image;
	this.img.src = image.data;
};

//Get image URL
ImageChooser.prototype.getValue = function()
{
	return this.value;
};

ImageChooser.prototype.updateVisibility = function()
{
	this.element.style.visibility = this.visible ? "visible" : "hidden";
};
