<script>
var readingsShown = "0";
var PrevDate = "";
var NextDate = "";
var abccc;

 jQuery("#btnSelectDate").click(function(e){
    e.preventDefault();
    if(document.getElementById("txtDate").value == "") // invalid data
    {
        alert("Please select a Date");
    }
    else // good to go
    {
		generateReadings();
    }
});

function onDateChange(){
    if(document.getElementById("txtDate").value == "")   {
        alert("Please select a Date");
    }
    else {
		generateReadings();
    }
}
document.getElementById("txtDate").addEventListener('change', onDateChange);

 if(document.getElementById("txtDate").value == "") 
 {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1;
	var yyyy = today.getFullYear();
	if (dd < 10) { dd = '0' + dd; } 
	if (mm < 10) { mm = '0' + mm; } 
	today = yyyy + '-' + mm + '-' + dd;
	document.getElementById("txtDate").value = today;
	generateReadings();
}

document.getElementById("btnPrevDayReadings").addEventListener("click", LoadPrevDayReadings);
document.getElementById("spanPrevDate").addEventListener("click", LoadPrevDayReadings);
function LoadPrevDayReadings(){
	 if(document.getElementById("txtDate").value == "") 
	 {
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth() + 1;
		var yyyy = today.getFullYear();
		if (dd < 10) { dd = '0' + dd; } 
		if (mm < 10) { mm = '0' + mm; } 
		today = yyyy + '-' + mm + '-' + dd;
		document.getElementById("txtDate").value = today;
		generateReadings();
	}
	else{
		var dateEntered = new Date(document.getElementById("txtDate").value + " 00:00:00");
		dateEntered.setDate(dateEntered.getDate()-1);
		var today = new Date();
		var dd = dateEntered.getDate();
		var mm = dateEntered.getMonth() + 1;
		var yyyy = dateEntered.getFullYear();
		if (dd < 10) { dd = '0' + dd; } 
		if (mm < 10) { mm = '0' + mm; } 
		today = yyyy + '-' + mm + '-' + dd;
		document.getElementById("txtDate").value = today;
		generateReadings();
	}
}

document.getElementById("btnNextDayReadings").addEventListener("click", LoadNextDayReadings);
document.getElementById("spanNextDate").addEventListener("click", LoadNextDayReadings);
function LoadNextDayReadings(){
	 if(document.getElementById("txtDate").value == "") 
	 {
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth() + 1;
		var yyyy = today.getFullYear();
		if (dd < 10) { dd = '0' + dd; } 
		if (mm < 10) { mm = '0' + mm; } 
		today = yyyy + '-' + mm + '-' + dd;
		document.getElementById("txtDate").value = today;
		generateReadings();
	}
	else{
		var dateEntered = new Date(document.getElementById("txtDate").value + " 00:00:00");
		dateEntered.setDate(dateEntered.getDate()+1);
		var today = new Date();
		var dd = dateEntered.getDate();
		var mm = dateEntered.getMonth() + 1;
		var yyyy = dateEntered.getFullYear();
		if (dd < 10) { dd = '0' + dd; } 
		if (mm < 10) { mm = '0' + mm; } 
		today = yyyy + '-' + mm + '-' + dd;
		document.getElementById("txtDate").value = today;
		generateReadings();
	}
}

function generateReadings(){
var validdateentry = "0";

try{
		var Date_1 = "05/05/2022";
        var Date_2 = "05/05/2035";
		var Date_to_check  = moment(document.getElementById("txtDate").value, 'YYYY-MM-D').format('MM/DD/YYYY');
			
		var D_1 = Date_1.split("/");
        var D_2 = Date_2.split("/");
        var D_3 = Date_to_check.split("/");
             
		var d1 = new Date(D_1[2], parseInt(D_1[1]) - 1, D_1[0]);
		var d2 = new Date(D_2[2], parseInt(D_2[1]) - 1, D_2[0]);
		var d3 = new Date(D_3[2], parseInt(D_3[1]) - 1, D_3[0]);
		 
		if (d3 > d1 && d3 < d2) {
			validdateentry = "1";
		} else {
			validdateentry = "0";
		}
		
		if( validdateentry == "1")
		{
				var today = moment(document.getElementById("txtDate").value, 'YYYY-MM-D').format('DD-MM-YYYY');

				document.getElementById("lblSeasonName").innerHTML = "Loading...";
				var getJSON = function(url, callback) {
				var xhr = new XMLHttpRequest();
				xhr.open('GET', url, true);
				xhr.responseType = 'json';    
				xhr.onload = function() {    
					var status = xhr.status;        
					if (status == 200) {
						callback(null, xhr.response);
					} else {
							callback(status);
						}
					};    
					xhr.send();
				};

				getJSON('https://syrocalendar.com/SyroMalabarCalendar/?Mode=JSON&Type=DailyReadings&Date=' + today,  function(err, tmtm) {    
					if (err != null) {
						console.error("Errr" + err);
					} 
					else if(tmtm == null){
						alert("Something went wrong... Please recheck the entered date...");
					}			
					else {
					
						readingsShown = "1";
						document.getElementById('SectionResults').style.display = "block";
						// **Syro Malabar Calendar API provided by TMTM WebKraft. For more info, visit https://tmtmwebkraft.com **
						var ContentMalayalamReading = "";
						var ContentEnglishReading = "";
						var ReadingFlag = 0;
						var engReadingCounter = 1;
						var malReadingCounter = 1;
						abccc = tmtm;
						var itemDate = document.getElementById("txtDate").value;
						
						document.getElementById("lblSeasonName").innerHTML = ((set = (tmtm?.Set1?.[0] ? tmtm.Set1 : tmtm?.Set2)?.[0]) => set ? `${set.SeasonName_Eng_Full} : ${set.DayDescription_Eng} <br> ${set.SeasonName_Mal_Full} : ${set.DayDescription_Mal}` : '')();
						
						tmtm["Set1"].forEach((item) => {
							if(ReadingFlag == 0){
								ContentMalayalamReading = ContentMalayalamReading + "<li class='active'><h3 class=\"question MalFont\"><span>" + item.DayDescription_Mal + "</span><div class=\"plus-minus-toggle collapsed\"></div></h3> <div class=\"answer MalFont\">";
							}
							else {
								ContentMalayalamReading = ContentMalayalamReading + "<li><h3 class=\"question MalFont\"><span>" + item.DayDescription_Mal + "</span><div class=\"plus-minus-toggle\"></div></h3> <div class=\"answer MalFont\">";
							}
							if(item.Reading1_Mal != null)
								ContentMalayalamReading = ContentMalayalamReading + renderReadingItem(item.Reading1_Title_Mal, item.Reading1_Mal, malReadingCounter++ , itemDate, 1, "mal", " 1) ");
							if(item.Reading2_Mal != null)
								ContentMalayalamReading = ContentMalayalamReading +  renderReadingItem(item.Reading2_Title_Mal, item.Reading2_Mal, malReadingCounter++ , itemDate, 1, "mal", " 2) ");
							if(item.Reading3_Mal != null)
								ContentMalayalamReading = ContentMalayalamReading +  renderReadingItem(item.Reading3_Title_Mal, item.Reading3_Mal, malReadingCounter++ , itemDate, 1, "mal", " 3) ");
							if(item.ReadingGospal_Mal != null)
								ContentMalayalamReading = ContentMalayalamReading + renderReadingItem(item.ReadingGospal_Title_Mal, item.ReadingGospal_Mal, malReadingCounter++ , itemDate, 1, "mal", " G) ");		
							
							ContentMalayalamReading = ContentMalayalamReading + "</div></li>";
							
							if(ReadingFlag == 0){
								ContentEnglishReading = ContentEnglishReading + "<li class='active'><h3 class=\"question MalFont\"><span>" + item.DayDescription_Eng + "</span><div class=\"plus-minus-toggle collapsed\"></div></h3> <div class=\"answer MalFont\">";
							}
							else {
								ContentEnglishReading = ContentEnglishReading + "<li><h3 class=\"question MalFont\"><span>" + item.DayDescription_Eng + "</span><div class=\"plus-minus-toggle\"></div></h3> <div class=\"answer MalFont\">";
							}
							if(item.Reading1_Eng != null)
									ContentEnglishReading = ContentEnglishReading + renderReadingItem(item.Reading1_Title_Eng, item.Reading1_Eng, engReadingCounter++ , itemDate, 1, "eng", " 1) ");
							if(item.Reading2_Eng != null)
									ContentEnglishReading = ContentEnglishReading + renderReadingItem(item.Reading2_Title_Eng, item.Reading2_Eng, engReadingCounter++ , itemDate, 1, "eng", " 2) ");
							if(item.Reading3_Eng != null)
									ContentEnglishReading = ContentEnglishReading + renderReadingItem(item.Reading3_Title_Eng, item.Reading3_Eng, engReadingCounter++ , itemDate, 1, "eng", " 3) ");
							if(item.ReadingGospal_Eng != null)
									ContentEnglishReading = ContentEnglishReading + renderReadingItem(item.ReadingGospal_Title_Eng, item.ReadingGospal_Eng, engReadingCounter++ , itemDate, 1, "eng", " G) ");	
							
							ContentEnglishReading = ContentEnglishReading + "</div></li>";	
							ReadingFlag++;		
						});
							
						document.getElementById("MalayalamReadings").innerHTML = ContentMalayalamReading;
						document.getElementById("EnglishReadings").innerHTML = ContentEnglishReading; 
						
					
						ContentMalayalamReading = "";
						ContentEnglishReading = "";
						ReadingFlag = 0;
						engReadingCounter = 1;
						malReadingCounter = 1;
						
						tmtm["Set2"].forEach((item) => {
							if(ReadingFlag == 0){
								ContentMalayalamReading = ContentMalayalamReading + "<li class='active'><h3 class=\"question MalFont\"><span>" + item.DayDescription_Mal + "</span><div class=\"plus-minus-toggle collapsed\"></div></h3> <div class=\"answer MalFont\">";
							}
							else {
								ContentMalayalamReading = ContentMalayalamReading + "<li><h3 class=\"question MalFont\"><span>" + item.DayDescription_Mal + "</span><div class=\"plus-minus-toggle\"></div></h3> <div class=\"answer MalFont\">";
							}
							if(item.Reading1_Mal != null)
								ContentMalayalamReading = ContentMalayalamReading + renderReadingItem(item.Reading1_Title_Mal, item.Reading1_Mal, malReadingCounter++ , itemDate, 2, "mal", " 1) ");
							if(item.Reading2_Mal != null)
								ContentMalayalamReading = ContentMalayalamReading + renderReadingItem(item.Reading2_Title_Mal, item.Reading2_Mal, malReadingCounter++ , itemDate, 2, "mal", " 2) ");
							if(item.Reading3_Mal != null)
								ContentMalayalamReading = ContentMalayalamReading + renderReadingItem(item.Reading3_Title_Mal, item.Reading3_Mal, malReadingCounter++ , itemDate, 2, "mal", " 3) ");
							if(item.ReadingGospal_Mal != null)
								ContentMalayalamReading = ContentMalayalamReading + renderReadingItem(item.ReadingGospal_Title_Mal, item.ReadingGospal_Mal, malReadingCounter++ , itemDate, 2, "mal", " G) ");		
							
							ContentMalayalamReading = ContentMalayalamReading.replaceAll(null, '') + "</div></li>";
							
							if(ReadingFlag == 0){
								ContentEnglishReading = ContentEnglishReading + "<li class='active'><h3 class=\"question MalFont\"><span>" + item.DayDescription_Eng + "</span><div class=\"plus-minus-toggle collapsed\"></div></h3> <div class=\"answer MalFont\">";
							}
							else {
								ContentEnglishReading = ContentEnglishReading + "<li><h3 class=\"question MalFont\"><span>" + item.DayDescription_Eng + "</span><div class=\"plus-minus-toggle\"></div></h3> <div class=\"answer MalFont\">";
							}
							if(item.Reading1_Eng != null)
								ContentEnglishReading = ContentEnglishReading + renderReadingItem(item.Reading1_Title_Eng, item.Reading1_Eng, engReadingCounter++ , itemDate, 2, "eng", " 1) ");
							if(item.Reading2_Eng != null)
								ContentEnglishReading = ContentEnglishReading + renderReadingItem(item.Reading2_Title_Eng, item.Reading2_Eng, engReadingCounter++ , itemDate, 2, "eng", " 2) ");
							if(item.Reading3_Eng != null)
								ContentEnglishReading = ContentEnglishReading + renderReadingItem(item.Reading3_Title_Eng, item.Reading3_Eng, engReadingCounter++ , itemDate, 2, "eng", " 3) ");
							if(item.ReadingGospal_Eng != null)
								ContentEnglishReading = ContentEnglishReading + renderReadingItem(item.ReadingGospal_Title_Eng, item.ReadingGospal_Eng, engReadingCounter++ , itemDate, 2, "eng", " G) ");		
							
							ContentEnglishReading = ContentEnglishReading + "</div></li>";	
							ReadingFlag++;
							
						});
							
						document.getElementById("MalayalamReadingsSet2").innerHTML = ContentMalayalamReading;
						document.getElementById("EnglishReadingsSet2").innerHTML = ContentEnglishReading; 					
						
						jQuery('.faq li .question').click(function () {  jQuery(this).find('.plus-minus-toggle').toggleClass('collapsed');  jQuery(this).parent().toggleClass('active');
						});
						//document.getElementById('SectionResults').scrollIntoView();
						getPrevAndNextDates();
					}
				});
			}
			else{
				//alert("Please enter a valid Date");
				document.getElementById("lblSeasonName").innerHTML = "Invalid Input Date";
				document.getElementById("MalayalamReadings").innerHTML = "";
				document.getElementById("EnglishReadings").innerHTML = "";
				document.getElementById("MalayalamReadingsSet2").innerHTML = "";
				document.getElementById("EnglishReadingsSet2").innerHTML = "";
			}
		}
		catch(err){
			alert("Something went wrong... Please try again..." . err);
		}
}    

if( readingsShown == "0")
	generateReadings();
	
	
function getPrevAndNextDates(){
		const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		
		var dateEntered = new Date(document.getElementById("txtDate").value + " 00:00:00");
		dateEntered.setDate(dateEntered.getDate()-1);
		var dd = dateEntered.getDate();
		var yyyy = dateEntered.getFullYear();
		if (dd < 10) { dd = '0' + dd; } 
		PrevDate =  monthNames[dateEntered.getMonth()] + ' ' + dd + ', ' + yyyy;
		
		dateEntered = new Date(document.getElementById("txtDate").value + " 00:00:00");
		dateEntered.setDate(dateEntered.getDate()+1);
		var dd = dateEntered.getDate();
		var yyyy = dateEntered.getFullYear();
		if (dd < 10) { dd = '0' + dd; } 
		NextDate =  monthNames[dateEntered.getMonth()] + ' ' + dd + ', ' + yyyy;
		
		document.getElementById("spanPrevDate").innerText = " " + PrevDate;
		document.getElementById("spanNextDate").innerText =  NextDate +  " ";
}
document.getElementById("btnNextDayReadings").setAttribute('title',"Show Next Day's Readings");
document.getElementById("btnPrevDayReadings").setAttribute('title',"Show Previous Day's Readings");
document.getElementById("txtDate").setAttribute('title',"Click to Select a Date");	

function formatUrlDate(dateStr) {
	if (!dateStr || dateStr === "undefined" || dateStr === "null") return "";

		var dateEntered = new Date(document.getElementById("txtDate").value);
		dateEntered.setDate(dateEntered.getDate()+1);
		var today = new Date();
		var dd = dateEntered.getDate();
		var mm = dateEntered.getMonth() + 1;
		var yyyy = dateEntered.getFullYear();
		if (dd < 10) { dd = '0' + dd; } 
		if (mm < 10) { mm = '0' + mm; } 
		return `${dd}-${mm}-${yyyy}`;
}

function renderReadingItem(title, ref, readingNum, rawDate, setNum, lang, prefix = '') {
	if (!ref || String(ref).trim() === "" || String(ref).toLowerCase() === "null") return '';
	const formattedDate = formatUrlDate(rawDate);
	const targetUrl = `https://syrobible.com/LiturgicalReadings?Date=${encodeURIComponent(formattedDate)}&Reading=${encodeURIComponent(readingNum || '')}&Set=${encodeURIComponent(setNum || '')}&Lang=${encodeURIComponent(lang || '')}`;
	
	return `<a href="${targetUrl}" target='_blank' style="display: block; text-decoration: none;">
		<div style="display: flex; justify-content: space-between; align-items: end;">
			<b class="Chpters">${prefix}${ref}</b>
			<span>&#10140;</span>
		</div>
		<span class="ReadingsTitle">${title || ''}</span>
	</a>`;
}

</script>