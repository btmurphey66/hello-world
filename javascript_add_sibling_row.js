jQuery(document).ready(function(){

 var table = jQuery('#listing_table').DataTable();
 var content_cat_id = jQuery('#listing_table').attr('cid');

//check if sibling_content button is clicked 
jQuery("#sibling_content").on("click", function () {
	
	//check if sibling content action is inactive (i.e. the row to make siblings from hasn't been selected yet)
	if (jQuery("#sibling_content").hasClass('inactive')){
		
	//get the current order for the end draw function
	var order = table.order();
	var orderCol = order[0][0];
	var orderDir = order[0][1];
		
		//clear any previous data from session
		sessionStorage.clear();

		//if more than 1 box is checked, then show alert message
		if(table.rows({selected:true}).nodes().length !=1) {
			alert("Please select only one row to start");
			return;
		}else{
			
			//for the selected row...
			table.rows({selected:true}).every(function(rowIdx){  //using this every function for convenience, even though it only cycles once.		
				table.columns().every( function () {
					var col = this.index();
					var cell = table.cell(rowIdx,col).node();
					//check if the class contains trait-content or trait_rel (must use contains due to added sorting class)
					if (jQuery(cell).hasClass('trait_content')) {
							var txt = jQuery.trim(jQuery(cell).text());
							sessionStorage.setItem(col, txt);
						}								
					
				});

			
			});
		}	
		jQuery("#sibling_content").removeClass('inactive').addClass('active');
		jQuery("#sibling_content").css("color","red");
		
	}else{
		//Sibling content is active (row to make sibling content from has already been selected and stored in session)
		
		//if no boxes are checked, then show alert message
		if(table.rows({selected:true}).nodes().length <=0) {
			alert("Please select one or more sibling rows");
			return;
		}else{			
			
		//take text from session storage and store attributes to tableArray.
		var tableArray = new Array();
		var i =0;
		//iterate through every selected row
		table.rows({selected:true}).every(function(rowIdx, tableLoop, rowLoop){
		//iterate through every column
			table.columns().every( function () {
				//skip over gathering from the checkbox column
				if (!jQuery(colhead).hasClass('select-checkbox')){
					var colhead = this.header();
					var col = this.index();
					var cell = table.cell(rowIdx,col).node();
					////row
					var id='';     		//content id for the row
					////column
					var cc='';			//content category id for the column
					var tc='';			//trait category id for the column (if trait-content)
					var ryci='';		//relation type category id for the column
					////cell
					var ti='';			//trait id for the cell
					var txt = ''		//text of the cell
					var sti='';		//selected trait id for the cell (only if dropdown)
					
					////Determined
					//var ortci='';		//other related trait category ids for the row (if trait_rel)
					
					var id = jQuery(cell).closest('tr').attr('id');
					var cc = jQuery(colhead).attr('cc');
					var tc = jQuery(colhead).attr('tc');
					var ryci = jQuery(colhead).attr('ryci');
					//var ti = jQuery(cell).attr('ti');
					
					//check cell relation to determine where to get text			
					if (ryci == 0) {	
						//get the text from of the original sibling from session storage
						var txt = sessionStorage.getItem(col);
					}else {
						var txt = jQuery(cell).text();

					}					
				}
					//save type, pass and txt as object to tableArray
					tableArray[i]={row:rowIdx, col:col, cc:cc, tc:tc, ryci:ryci, ti:ti, txt:txt};

					i++;
			});
		});
		
		var table_segment=JSON.stringify(tableArray);
		
		if (table_segment!=''){
			jQuery.ajax({
				method: "POST",
				url:"editor.php",
				data:{table_segment:table_segment},
				success: function(response) {
	console.log(response);			 
				 			 
				}

			}); 	
		}

/* console.log(tableArray);
console.log(table_segment); */
jQuery("#sibling_content").removeClass('active').addClass('inactive');
jQuery("#sibling_content").css("color","white");
sessionStorage.clear();
return;		
			
			
		}
		
		jQuery("#sibling_content").removeClass('active').addClass('inactive');
		jQuery("#sibling_content").css("color","white");
		sessionStorage.clear();		
	}
	

//deselect the selected rows for safety purposes
table.rows({selected:true}).deselect();
});
});
