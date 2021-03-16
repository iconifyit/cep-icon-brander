var reuse = [];
var threeUp,
    theOutline;

var artboardCount = 8;

app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;

// ****************** DETAIL IMAGE 01 *****************
// Artboard name : envato@1170x1500-01
// ****************************************************

rules.setLayerMode( RulesLayerModes.ADD_NEW );

for (var i = 0; i < artboardCount; i++) {
	rules.add({
		TARGET  : String('envato@1170x1500-0' + (i + 1)),
		GUTTER  : 0,
		COLS    : 3,
		ROWS    : 2,
		SCALE   : 500,
		VOFF    : 64,
		HOFF    : 64,
		SORT    : true,
		onLoad : function(fileList) {

		    var iconsPerPage = (this.getCols() * this.getRows());

            var start = i * iconsPerPage ;
            var end   = start + iconsPerPage;

            Host.logger.info('Iteration {iter}, start {start}, end {end}, target {name}, artboards {artboards}', {
                iter   : i,
                start  : start,
                end    : end,
                name   : this.getTarget(),
                artboards :  Math.ceil( fileList.length / iconsPerPage )
            });

		    if ( i > Math.ceil( fileList.length / iconsPerPage) ) {
		        this.setSkip(true);
		        return [];
            }

			if (fileList.length < end) end = fileList.length;

			var theSlice = fileList.slice(start, end);

			Host.logger.info('Icons {start} thru {end} to be added to artboard {name}', {
				start : start,
				end   : end,
				name  : this.getTarget()
			});

			return theSlice;
		},
		onFinish : function(theIcons) {
			Host.logger.info('{count} icons were added to artboard {name}', {
				count : theIcons.length,
				name  : this.getTarget()
			});
			activeDocument.selection = null;
		}
	});
}

// ****************** COVER IMAGE *******************
// Artboard name : envato@2340x1560
// ****************************************************

rules.add({
    TARGET : 'envato@2340x1560',
    GUTTER : 0,
    COLS   : 6,
    ROWS   : 4,
    SCALE  : 150,
    VOFF   : 1500,
    HOFF   : 64,
    SORT   : true,
    onLoad : function(fileList) {
        return [];
    },
    onFinish : function(theIcons) {

        Host.logger.info('Creating Cover Card for {target}', {
            target  : this.getTarget()
        });

        var doc,
            layer,
            artboard;

        doc      = activeDocument
        artboard = doc.artboards[doc.artboards.getActiveArtboardIndex()];

        // layer    = app.activeDocument.activeLayer;

        layer = rules.getPreviousLayer();

        Host.logger.info('Previous layer : {s}', {s: layer.name});

        var groupItems  = layer.groupItems;
        var productCart = layer.groupItems.getByName('product-card@1208x840');

        // Place threeUp

        try {
            doc.selection = null;
            productCart.selected = true;
			app.executeMenuCommand('copy');
			// app.executeMenuCommand('pasteFront');
            //
			// var theItem = doc.selection[0];
			doc.selection  = null;

			setActiveArtboard(
				getArtboardIndex(this.getTarget())
			);

			doc.activeLayer = rules.getLayer();

            var bg = new Background({
                fillColor : new RGB(
                    getRandomInt(230, 255),
                    getRandomInt(230, 255),
                    getRandomInt(230, 255)
                ),
                name : 'bg-' + this.getTarget()
            });

            bg.selected = true;

            app.executeMenuCommand('pasteFront');

            bg.selected = false;

            var theItem = doc.selection[0];

            doc.selection  = null;

			var source = theItem; // doc.groupItems[284];
			var target = bg;      // doc.pathItems[4339];

			target.selected = true;
			app.executeMenuCommand('group');
			target = doc.selection[0];

			source.position = target.position;

			source.resize(
				200,
                200,
				true,
				true,
				true,
				true,
                200
			);

			var rect = artboard.artboardRect;

			source.position = [
				( (rect[2] - rect[0]) - (source.width)  ) / 2,
                ( ( (rect[3] - rect[1]) + (source.height) ) / 2 )
			];

        }
        catch(e) {
            Host.logger.error(
                '{target} threeup error : {err}',
                {target: this.getTarget(), err: e.message}
            );
        }

        doc.selection = null;
    }
});
