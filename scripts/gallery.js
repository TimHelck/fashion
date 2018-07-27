var CPH = window.CPH || {};
CPH.loadGalleries = function(data) {


function renderGalleries(d) {
	var r = '';
	$.each(d.galleries , function(i, g){
console.log("Line 8: " + g.title + " -- " + g.description);
		r += renderGallery(1,  i, g.title, g.description,   g.pictures);
		
	});

	$('#galleries').html(r);
	
	$("#galleries .openSlide").on("click", {d:d}, handleGalleryClick);
}

function handleGalleryClick(e) {
	var data = e.data.d;
	var target = e.target;
	if(target.className === "openSlide") {
		openSlide(target, data);
	}
}

function openSlide(target, data) {
	var expandable = $(target).closest(".cell").find(".expandable")[0];
console.log("Line 35");
	var node = getNode(
		$(expandable).data('dataaddress'), 
		data.galleries);
	console.log(node);
	var imageFileParts = node.fileName.split('/');
	//var largeImagePath =  './galleryImages/large/' + node.fileName + '.jpg';
	//var displayImagePath =  './galleryImages/display/' + node.fileName + '.jpg';
	var largeImagePath =    './galleryImages/' + imageFileParts[0] + '/large/'   + imageFileParts[1];
	var displayImagePath =  './galleryImages/' + imageFileParts[0] + '/display/' + imageFileParts[1];
console.log("Line 45: " + largeImagePath + ' -- ' + displayImagePath);
//c +=	"<img class='basicImg' src='./galleryImages/" + imageFileParts[0] + '/thumbnail/' + imageFileParts[1] + "'>";
	var data = { fileName: node.fileName,
	             imageDir: './galleryImages/display/',
				 title:    node.title
	};
	slideTray.loadSlide(data);

}


function renderGallery(level, key, galleryName, description, d) {
//console.log("Line 53: " + galleryName + " -- " + description);
	var r = "<section class='imageGrid'><div class='title'>" + galleryName + "</div>";
	if(description) {
		r += "<div class='galleryDescription'>" + description + "</div>";
	}
	r += "<div>";
//console.log("Line 59: " + r);
	var c;
	if(level > 3) { return; }
	jQuery.each(d, function(i, x) {
//console.log("Line 63: " + x.imageFile);
		var imageFileParts = x.imageFile.split('/');
		if(x.pictures) { 
//console.log("Line 93: " + x.galleryName + " -- " + x.description);
			c  =	"	<div class='cell isCollapsed'>";
			c +=	"		<div class='expandable' data-dataaddress='" + key + ":" + i + "'>";
			c +=	"			<div class='subGalleryLinkContainer'>";
			//c +=	"				<img class='basicImg' src='./galleryImages/thumbnail/" + x.imageFile + ".jpg'>";
			c +=	"				<img class='basicImg' src='./galleryImages/" + imageFileParts[0] + '/thumbnail/' + imageFileParts[1] + "'>";
			c +=	"				<div class='galleryTitle'>" + x.title + "</div>";
			c +=	"			</div>";
			c +=	"			<div class='arrowUp'></div>";
			c +=	"		</div>";
			c +=	"		<div class='expand'>";
			c += renderGallery(level+1, key + ':' + i,  x.title, x.description, x.pictures );
			c +=	"		</div>";
			c +=	"	</div>";		
		}
		else {
//console.log("Line 110: " + x.galleryName + " -- " + x.description);
			c  =	"	<div class='cell isCollapsed'>";
			c +=	"		<div class='expandable' data-dataaddress='" + key + ":" + i + "'>";
			//c +=	"			<img class='basicImg' src='./galleryImages/thumbnail/" + x.imageFile + ".jpg'>";
			c +=	"			<img class='basicImg' src='./galleryImages/" + imageFileParts[0] + '/thumbnail/' + imageFileParts[1] + "'>";
			c +=	"			<div class='arrowUp'></div>";
			c +=	"		</div>";
			c +=	"		<div class='expand'>";
			c +=    "			<div class='leftColumn'>";
			c += renderPictureDescription(x);
			c +=    "			</div>";
			c +=    "			<div class='leftColumnRelated'></div>";
			//c +=	"			<img class='largeImageMain' src='./galleryImages/display/" + x.imageFile + ".jpg'>";
			c +=	"			<img class='largeImageMain' src='./galleryImages/" + imageFileParts[0] + '/display/' + imageFileParts[1] + "'>";
			c +=	"			<img class='largeImageRelated' src=''>";
			c +=    "			<div class='rightColumn'>";
			c +=    "				<div class='buttons'>";
			c +=	"					<img src='./images/openSlide.png' class='openSlide'>";
			c +=	"					<a class='expandClose'>&times;</a>";
			c +=    "				</div>";
			c += renderRelatedPictures(x.relatedPictures || [], key + ':' +i);
			c +=    "			</div>";
			c +=	"		</div>";
			c +=	"	</div>";
		}
		r += c;
	});
	r +=	"</div></section>";
	return r;
}

function renderPictureDescription(d) {
	var r = "";
	jQuery.each(['title', 'medium', 'description'], function(i, x) {
		if(d[x]) {
			r += "<div class='" + x + "'>" + d[x] + "</div>";
		}
	});
	return r;
}


function renderRelatedPictures(d, key) {
	var r = "<div class='relatedPictures'>";
	if(d.length) {
		r += "<div class='title'>Related Pictures</div>";
	}	
	var c = '';
	jQuery.each(d, function(i, x) {
		c +=	"		<div class='related' data-dataaddress='" + key + ":" + i + "'>";
		c +=	"			<img class='basicImg' src='./galleryImages/thumbnail/" + x.imageFile + ".jpg'>";
		c +=	"			<div class='title'>" + (x.title || "") + "</div>";
		c +=	"		</div>";
	});
	r += c;
	r +=	"</div>";
	return r;
}


renderGalleries(data);


var $cell = $('.cell');

$cell.find('.expandable').click(function() {
  var $thisCell = $(this).closest('.cell');
	$('body').trigger('restoreMainPictureEvent');

  if ($thisCell.hasClass('isCollapsed')) {
    $cell.not($thisCell).not($($thisCell.parents())).removeClass('isExpanded').addClass('isCollapsed');
    $thisCell.removeClass('isCollapsed').addClass('isExpanded');
  } else {
    $thisCell.removeClass('isExpanded').addClass('isCollapsed');
  }
});

$cell.find('.expandClose').click(function() {
	var $thisCell = $(this).closest('.cell');
	$('body').trigger('restoreMainPictureEvent');

	$thisCell.removeClass('isExpanded').addClass('isCollapsed');
});

function showRelatedImage() {
	var node = getNode($(this).data('dataaddress'), data.galleries);
	var relatedImagePath =  './galleryImages/display/' + node.fileName + '.jpg';

	var largeImageExpand = $($('.isExpanded')[0]).find('.expand');
	var largeImageRelated = largeImageExpand.find('.largeImageRelated');
	largeImageRelated.attr('src', relatedImagePath);
	largeImageExpand.addClass('showRelated');


}

function showRelatedImageDescription() {
	var dataAddress = $(this).data('dataaddress');
	var mainPictureDataAddress = dataAddress.split(':').slice(0,-1).join(':');
	var node     = getNode(dataAddress, data.galleries);
	var mainNode = getNode(mainPictureDataAddress, data.galleries);
	var r = "";

	r +=	"		<div class='related restoreMainPicture' data-dataaddress='" + mainPictureDataAddress + "'>";
	r +=	"			<img class='basicImg' src='./galleryImages/thumbnail/" + mainNode.fileName + ".jpg'>";
	r +=	"			<div class='subTitle'>Return to main picture</div>";
	r +=	"		</div>";
		
	
	jQuery.each(['title', 'medium', 'description'], function(i, x) {
		if(node[x]) {
			r += "<div class='" + x + "'>" + node[x] + "</div>";
		}
	});

	var largeImageExpand = $($('.isExpanded')[0]).find('.expand');
	var relatedDescription = largeImageExpand.find('.leftColumnRelated');
	relatedDescription.html(r);
	largeImageExpand.addClass('showRelated');


	$('.restoreMainPicture').click(function(){$('body').trigger('restoreMainPictureEvent');});
	
}

$('.relatedPictures .related').click(showRelatedImage);
$('.relatedPictures .related').click(showRelatedImageDescription);

function restoreMainPicture() {
	var largeImageExpand = $($('.isExpanded')[0]).find('.expand');
	largeImageExpand.removeClass('showRelated');
}

$('body').on('restoreMainPictureEvent', restoreMainPicture);

// TODO: memoize
function getNode(address, data) {
	var aa = address.split(':');  // address array
	var a = aa[0];  
	var a = parseInt(a, 10) || a;  
	if (aa.length > 1) {
		if (data[a].pictures) {
			return getNode(aa.slice(1).join(":"), data[a].pictures);
		}
		else if(data[a].relatedPictures) {
			return getNode(aa.slice(1).join(":"), data[a].relatedPictures);
		}
		else {
			return {error:'invalidIndex'};
		}
	}
	else if(data[a]){
		var r = {
			title:       data[a].title || '',
			fileName:    data[a].imageFile,
			description: data[a].description   || '',
			medium:      data[a].medium || ''
		};
		return r;
	}
	else {
		return {error:'invalidIndex'};
	}
}

};

var url = 'data/pictureData.json';
if(document.location.host.match(/localhost/)) {
	url = 'data/pictureData.json';
}

$.ajax({
	dataType: "text",
	url: url,
	success: function (data) {
		var obj = $.parseJSON(data);
		CPH.loadGalleries(obj);
	},
});

