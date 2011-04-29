CodeMirror.defineMode("ruby", function() {

    function wordRegexp(words) {
        return new RegExp("^(?:" + words.join("|") + ")$");
    }

    var identifierStarters = /[_A-Za-z]/;
    var wordOperators = wordRegexp(['and', 'or', 'not', '&&', '||']);
    var commonKeywords = ['alias', 'BEGIN', 'begin', 'break', 'case',
      'def', 'defined', 'do', 'else', 'elsif', 'END',
      'end', 'ensure', 'false', 'for', 'if', 'in',
      'next', 'nil', 'redo', 'rescue', 'retry', 'return',
      'self', 'super', 'then', 'true', 'undef', 'unless',
      'until', 'when', 'while', 'yield', 'require', 'load',
      'raise', 'lambda', 'try', 'module', 'class'];
    var sketchupClasses = ['Animation','AppObserver','ArcCurve','Array','AttributeDictionaries',
      'AttributeDictionary','Behavior','BoundingBox','Camera','Color','Command','ComponentDefinition',
      'ComponentInstance','ConstructionLine','ConstructionPoint','Curve','DefinitionList','DefinitionObserver',
      'DefinitionsObserver','Drawingelement','Edge','EdgeUse','Entities','EntitiesObserver','Entity',
      'EntityObserver','Face','Geom','Group','Image','Importer','InputPoint','InstanceObserver',
      'LatLong','Layer','Layers','LayersObserver','Length','Loop','Material','Materials',
      'MaterialsObserver','Menu','Model','ModelObserver','Numeric','OptionsManager','OptionsProvider',
      'OptionsProviderObserver','Page','Pages','PagesObserver','PickHelper','Point3d','PolygonMesh',
      'RenderingOptions','RenderingOptionsObserver','SectionPlane','Selection','SelectionObserver',
      'Set','ShadowInfo','ShadowInfoObserver','Sketchup','SketchupExtension','String','Style','Styles',
      'Text','Texture','TextureWriter','Tool','Toolbar','Tools','ToolsObserver','Transformation','UI',
      'UTM','UVHelper','Vector3d','Vertex','View','ViewObserver','WebDialog'];

    return {
        startState: function() {
            return {
              context: 'normal',
              stringMarker: /"/,
              stringMarkerInverse: /[^"]/
          };
        },
        token: function(stream, state) {
            var ch = stream.next();

            if (state.context == 'normal') {
                if (ch == "#") { /* Detect comments. */
                    stream.skipToEnd();
                    return "rb-comment";

                } else if (ch == "@") { /* Detect decorators. */
                    if (stream.peek().match(/\w/)) {
                        stream.skipToEnd();
                        return "rb-decorator";
                    }

                } else if (ch == ".") { /* Detect object methods. */
                    stream.next();
                    if (stream.peek().match(/\w/)) {
                        stream.eatWhile(/[A-Za-z0-9_]/);
                        return "rb-method";
                    }

                } else if ((ch == "'") || (ch == '"')) {  /* Detect strings. */
                    if (ch == "'") {
                        state.stringMarker = /'/;
                        state.stringMarkerInverse = /[^']/;
                    } else {
                        state.stringMarker = /"/;
                        state.stringMarkerInverse = /[^"]/;
                    }
                    stream.eatWhile(state.stringMarker);
                    if (stream.current().length >= 3) {
                        state.context = 'string';
                    }
                    stream.eatWhile(state.stringMarkerInverse)
                    stream.next();
                    return "rb-string";

                } else if (ch.match(/[\d.]/)) { /* Detect numbers. */
                    stream.eatWhile(/[\d\.abcdefox]/);
                    return "rb-number";

                } else if (ch.match(/\w/)) { /* Detect keywords and SU classes. */
                    stream.eatWhile(/\w/);
                    if (stream.current().match(wordRegexp(commonKeywords))) {
                        return "rb-keyword";
                    } else if (stream.current().match(wordRegexp(sketchupClasses))) {
                        return "rb-su-class";
                    }
                }
            } else { /* We are in a multi-line string */
                stream.eatWhile(state.stringMarkerInverse); /* Eat the rest of the string. */
                numQuoted = stream.current().length;
                stream.eatWhile(state.stringMarker); /* Eat the closing quotes if they exist. */
                if (stream.current().length - numQuoted >= 3) {
                    state.context = 'normal';
                }
                return "rb-string";
            }
        }
    };
});

CodeMirror.defineMIME("text/x-ruby", "ruby");