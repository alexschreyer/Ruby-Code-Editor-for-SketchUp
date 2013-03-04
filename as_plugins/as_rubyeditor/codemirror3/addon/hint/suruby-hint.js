(function () {
  var Pos = CodeMirror.Pos;

  function forEach(arr, f) {
    for (var i = 0, e = arr.length; i < e; ++i) f(arr[i]);
  }
  
  function arrayContains(arr, item) {
    if (!Array.prototype.indexOf) {
      var i = arr.length;
      while (i--) {
        if (arr[i] === item) {
          return true;
        }
      }
      return false;
    }
    return arr.indexOf(item) != -1;
  }

  function scriptHint(editor, keywords, getToken, options) {
    // Find the token at the cursor
    var cur = editor.getCursor(), token = getToken(editor, cur), tprop = token;

    // If it's not a 'word-style' token, ignore the token.
		if (!/^[\w$_]*$/.test(token.string)) {
      token = tprop = {start: cur.ch, end: cur.ch, string: "", state: token.state,
                       type: token.string == "." ? "property" : null};
    }

    // If it is a property, find out what it is a property of.
    while (tprop.type == "property") {
      tprop = getToken(editor, Pos(cur.line, tprop.start));
      if (tprop.string != ".") return;
      tprop = getToken(editor, Pos(cur.line, tprop.start));
      if (tprop.string == ')') {
        var level = 1;
        do {
          tprop = getToken(editor, Pos(cur.line, tprop.start));
          switch (tprop.string) {
          case ')': level++; break;
          case '(': level--; break;
          default: break;
          }
        } while (level > 0);
        tprop = getToken(editor, Pos(cur.line, tprop.start));
	if (tprop.type.indexOf("variable") === 0)
	  tprop.type = "function";
	else return; // no clue
      }
      if (!context) var context = [];
      context.push(tprop);
    }


    return {list: getCompletions(token, context, keywords, options),
            from: Pos(cur.line, token.start),
            to: Pos(cur.line, token.end)};
  }


  // AS: Initialize the code completion function here
  CodeMirror.surubyHint = function(editor, options) {
    return scriptHint(editor, sketchupArr,
                      function (e, cur) {return e.getTokenAt(cur);},
                      options);
  };


  // AS: List SketchUp classes and methods here
  var sketchupClassesArr = ("Animation AppObserver ArcCurve Array AttributeDictionaries AttributeDictionary Behavior BoundingBox Camera Color Command ComponentDefinition ComponentInstance ConstructionLine ConstructionPoint Curve DefinitionList DefinitionObserver DefinitionsObserver Drawingelement Edge EdgeUse Entities EntitiesObserver Entity EntityObserver Face Geom Group Image Importer InputPoint InstanceObserver LatLong Layer Layers LayersObserver Length Loop Material Materials MaterialsObserver Menu Model ModelObserver Numeric OptionsManager OptionsProvider OptionsProviderObserver Page Pages PagesObserver PickHelper Point3d PolygonMesh RenderingOptions RenderingOptionsObserver SectionPlane Selection SelectionObserver Set ShadowInfo ShadowInfoObserver Sketchup SketchupExtension String Style Styles Text Texture TextureWriter Tool Toolbar Tools ToolsObserver Transformation UI UTM UVHelper Vector3d Vertex View ViewObserver WebDialog").split(" ");
  var sketchupMethodsArr = ("abort_operation activate active_entities active_layer active_layer= active_model active_path active_style active_style_changed active_tool_id active_tool_name active_view add add_3d_text add_action_callback add_arc add_circle add_cline add_context_menu_handler add_cpoint add_curve add_edges add_face add_faces_from_mesh add_frame_change_observer add_group add_image add_instance add_item add_line add_matchphoto_page add_ngon add_note add_observer add_point add_polygon add_separator add_style add_submenu add_text all_connected all_picked allow_actions_from_host alpha alpha= always_face_camera? always_face_camera= angle_between animation= app_name area arrow_type arrow_type= aspect_ratio aspect_ratio= at attribute_dictionaries attribute_dictionary average_color average_refresh_time axes back_material back_material= beep behavior best_picked blend blue blue= bounds break_edges? break_edges= bring_to_front camera camera= casts_shadows? casts_shadows= center check classify_point clear clear! clone close close_active closest_points cm color color= commit_operation common_edge common_face contains? convex? copy copy! copyright copyright= corner count count_edges count_instances count_points count_polygons create_cursor create_texture_writer creator creator= cross current current= curve curve_interior? cuts_opening? cuts_opening= deactivate definition definition= definitions degrees degrees_of_freedom delay_time delay_time= delete delete_attribute delete_key deleted? depth depth_at description description= diagonal direction direction= display? display_leader? display_leader= display_name display_name_from_action distance distance_to_line distance_to_plane do_options do_pick dot draw draw_line draw_lines draw_points draw_polyline draw_text draw2d drawing_color= dynamic= each each_edge each_key each_pair each_value edge edges edgeuses edit_transform enableVCB? end end_angle end_vertex_normal end= entities entityID equals? erase erase! erase_entities execute_script explode explode_curve export extensions eye face faces feet field_of_view field_of_view= file_extension file_new filename fill_from_mesh find_faces find_support_file find_support_files first first_edge fit_plane_to_points focal_length focal_length= followme format_angle format_area format_degrees format_length fov fov= georeferenced? get_attribute get_back_UVQ get_datfile_info get_datum get_default_dialog_color get_element_value get_front_UVQ get_glued_instances get_i18ndatfile_info get_last_state get_locale get_plane get_product_family get_resource_path get_shortcuts get_UVHelper getExtents getInstructorContentDirectory getMenu glued_to glued_to= green green= group? guess_target guid handle has_key? has_leader? height height= hidden? hidden_entities hidden= hide id identity? image? image_height image_width image_width= import inch include? inference_locked? init inputbox inputpoint insert insertion_point insertion_point= inspect inspector_names install_from_archive instances internal? interpolate intersect intersect_line_line intersect_line_plane intersect_plane_plane intersect_with invalidate invalidate_bounds inverse invert! is_curve? is_online is_polygon? is_pro? is_surface? is_valid_filename? is2d? is2d= key? keys km label large_icon= last_edge last_refresh_time latitude latlong_to_point layer layer= layers leader_type leader_type= leaf_at length length= line line_stipple= line_weight line_weight= line_width= linear_combination list_datums load load_file load_from_url load_on_start? loaded? local_bounds lock_inference locked? locked= longitude loop loops m make_unique manifold? material material= materials materialType max max_heigth max_heigth= max_width max_width= menu menu_text= mesh messagebox mile min min_heigth= min_width min_width= mipmapping? mipmapping= mm model model_info_pages modified? move! move_vertices name name= names navigation_button_enabled= navigation_buttons_enabled? new next nextFrame nitems no_scale_mask? no_scale_mask= normal normal_at normalize normalize! number_faces offset offset! on_line? on_plane? onActivePathChanged onActiveToolChanged onAfterComponentSaveAs onBeforeComponentSaveAs onCancel onChangeEntity onClose onComponentAdded onComponentInstanceAdded onComponentInstanceRemoved onComponentPropertiesChanged onComponentRemoved onComponentTypeChanged onContentsModified onCurrentLayerChanged onDeleteModel onElementAdded onElementModified onElementRemoved onEraseAll onEraseEntities onEraseEntity onExplode onKeyDown onKeyUp onLayerAdded onLayerRemoved onLButtonDoubleClick onLButtonDown onLButtonUp onMaterialAdd onMaterialChange onMaterialRefChange onMaterialRemove onMaterialSetCurrent onMaterialUndoRedo onMButtonDoubleClick onMButtonDown onMButtonUp onMouseEnter onMouseLeave onMouseMove onNewModel onOpen onOpenModel onOptionsProviderChanged onPlaceComponent onPostSaveModel onPreSaveModel onQuit onRButtonDoubleClick onRButtonDown onRButtonUp onRemoveAllLayers onRenderingOptionsChanged onReturn onSaveModel onSelectionAdded onSelectionBulkChange onSelectionCleared onSelectionRemoved onSetCursor onShadowInfoChanged onToolStateChanged onTransactionAbort onTransactionCommit onTransactionEmpty onTransactionRedo onTransactionStart onTransactionUndo onUserText onViewChanged open_file openpanel openURL options origin origin= os_language other_vertex outer? outer_loop outer_shell page_behavior page_behavior= pages parallel? parent parse_length partners path path_at pause perpendicular? perspective? perspective= pick pick_helper pick_segment picked_edge picked_element picked_face pickray pixelheight pixels_to_model pixelwidth place_component plane play_sound plugins_disabled? plugins_disabled= point point_at point_in_polygon_2D point_index point_to_latlong point_to_utm point= points polygon_at polygon_points_at polygons pop_tool position position_material position= post_url preferences_pages previous project_to_line project_to_plane purge_unused push_tool pushpull radians radius raytest read_default receives_shadows? receives_shadows= red red= refresh:View refresh_inspectors:UI refresh_thumbnail register_extension register_importer registered? remove remove_frame_change_observer remove_observer rendering_options require restore resume reverse reverse! reversed? reversed_in? rotation samedirection? save save_as save_thumbnail savepanel scaling screen_coords select_tool selected_page selected_page= selected_style selected_style= selection send_action set set! set_attribute set_background_color set_color_from_line set_curior set_datum set_file set_full_security set_html set_on_close set_plane set_point set_position set_size set_status_text set_text set_toolbar_visible set_url set_validation_proc set_visibility shadow_info shadows_face_sun? shadows_face_sun= shift show show_differences show_frame show_frame_at show_inspector show_modal show_model_info show_preferences single_object? size size= slideshow_time small_icon= smooth? smooth= snapto snapto= soft? soft= split start start_angle start_operation start_timer start_vertex_normal start= status_bar_text= status_text= stipple stipple= stop stop_timer style styles subtract supports_options? suspend tags tags= target template template_dir template= test_point text text= texture texture= title to_a to_cm to_component to_f to_feet to_i to_inch to_km to_l to_latlong to_m to_mile to_mm to_s to_utm to_yard toggle toolbar toolbar_names toolbar_visible? tools tooltip tooltip= transform transform! transform_by_vectors transform_entities transformation transformation_at transformation= transition_time transition_time= translation trim typename uncheck undo union unique_name unitvector? up update update_selected_style use_alpha? use_axes? use_axes= use_camera? use_camera= use_hidden? use_hidden_layers? use_hidden_layers= use_hidden= use_rendering_options? use_rendering_options= use_section_planes? use_section_planes= use_shadow_info? use_shadow_info= use_style? use_style= used_by? utm_to_point uv_at uvs valid? values vcb_label= vcb_value= vector vector_to vector= version version_number version= vertex vertices view visible? visible= volume vpheight vpwidth width width= write write_all write_default write_image x x= xaxis y y= yard yaxis z z= zaxis zone_letter zone_number zoom zoom_extents zrotation").split(" ");
  var sketchupArr = sketchupClassesArr.concat(sketchupMethodsArr);

  // AS: Assemble completions here (context-specific)
  function getCompletions(token, context, keywords, options) {

    var found = [], start = token.string;
    function maybeAdd(str) {
      if (str.indexOf(start) == 0 && !arrayContains(found, str)) found.push(str);
    }

    if (context) {

      // AS: Display only properties if we have a context
      forEach(keywords, maybeAdd);

    }
    else {

      // AS: Display only classes at any other point
      forEach(keywords, maybeAdd);

    }
    return found;
  }
})();
