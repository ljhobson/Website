

var margin = {};
margin.x = 10;
margin.y = 10;
margin.indent = 20;
var lineSpace = 6;
var settings = {
  lineSpace: 6,
  fontSize: 12,
  titleSize: 20,
  headingSize: 24,
  upperTitles: false,
};
var settingsElement = document.getElementById("settingsElement");
function applySettings() {
  settings = JSON.parse(settingsElement.value);
}
window.onload = function(event) {
  settingsElement.value = JSON.stringify(settings, null, 4);
}
var info = {};

info.name = "Louis Hobson";
info.description = "Graduate Software Engineer from the University of Canterbury";
info.contact = [];
info.contact.push({text: "louishobson5@gmail.com"});
info.contact.push({text: "(+64) 022 477 4142"});
//info.contact.push({text: "linkedin", link: "https://www.linkedin.com/in/louishobson-bwsgoat/"});
// info.contact.push({text: "github", link: "https://github.com/ljhobson"});
info.contact.push({text: "website", link: "https://lhobson.com/projects"});

info.keywords = "";
info.aboutMe = `My name is Louis Hobson, I am in my fourth and final year of Software Engineering at the University of Canterbury in Christchurch. I love coding and have been doing so for 7 years. I am a great web developer.`;


info.sections = [];
// don't forget yolo bedwars detection python
// git ... java. also typescript
// studyweave

var projectsList = [];

fetch('https://lhobson.com/projects.json', {
  method: 'GET'
}).then(function(e){
  return e.json();
}).then(function(e) {
  projectsList = e;
  console.log(projectsList);
  // finishSections();
});


function finishSections(projectsList) {
  projectsList.push({
    title: "For a full list of my projects, visit my site lhobson.com/projects",
    link: "https://lhobson.com/projects",
    notBold: true,
    underline: true, // also hides the link emoji
    description: "",
    date: "",
    content: []
  });

  info.sections.push({
    title: "Projects",
    subsections: projectsList
  });

  info.sections.push({
    title: "Experience",
    subsections: [
      {
        title: "Internship at Intranel",
        description: "Software Internship over the summer",
        date: "2025 - 2026",
        content: []
      }, {
        title: "TuneSoc Treasurer and Secretary",
        description: "",
        date: "2025",
        content: [
          "Organisation - Attention to Detail - Financial Analysis"
        ]
      }, {
        title: "CompSoc Industry and Academic Events Manager",
        description: "",
        date: "2024",
        content: [
          "Event Management - Communication - Organisation"
        ]
      }, {
        title: "Christchurch Adventure Park",
        notBold: false,
        description: "Kitchen Hand over the summer",
        date: "2023 – 2024",
        content: []
      }, {
        title: "COSC261 Class Rep",
        description: "",
        date: "2023",
        content: [
          "Communication - Professionalism"
        ]
      }, {
        title: "Mountain Warehouse Nelson",
        notBold: false,
        description: "Casual Staff member over the summer",
        date: "2022 – 2023",
        content: []
      },
    ]
  });


  // info.sections.push({
  //   title: "Achievements",
  //   subsections: [
  //     {
  //       title: "9th place in 2024 South Pacific ICPC Regional Finals in Sydney",
  //       notBold: false,
  //       description: "",
  //       date: "2024",
  //       content: []
  //     }, {
  //       title: "2nd place in the (witsoc x entre x compsoc x prodsoc) Hackathon!",
  //       notBold: false,
  //       description: "",
  //       date: "2023",
  //       content: []
  //     }, {
  //       title: "Certificate in Ergonomics",
  //       notBold: false,
  //       description: "",
  //       date: "2023",
  //       content: []
  //     }, {
  //       title: "Year 12 & 13 Mathematics Prize",
  //       notBold: false,
  //       description: "",
  //       date: "2020 – 2021",
  //       content: []
  //     }
  //   ]
  // });

  info.sections.push({
    title: "Achievements",
    subsections: [
      {
        title: "",
        notBold: false,
        description: "",
        date: "2024",
        content: ["9th place in 2024 South Pacific ICPC Regional Finals in Sydney", "2nd place in the (witsoc x entre x compsoc x prodsoc) Hackathon!", "Certificate in Ergonomics", "Year 12 & 13 Mathematics Prize"]
      }
    ]
  });


  info.sections.push({
    title: "Education",
    subsections: [
      {
        title: "University of Canterbury",
        description: "Bachelor of Engineering (Honours) in Software Engineering",
        date: "2022 – 2025",
        content: []
      }, {
        title: "Nelson College",
        notBold: true,
        description: "Prefect",
        date: "2017 – 2021",
        content: []
      // }, {
      //   title: "Roblox High School [Legacy]",
      //   notBold: true,
      //   description: "",
      //   date: "",
      //   content: []
      }
    ]
  });
}

function getCompanyName(jobDescription) {
  const apiKey = "AIzaSyCX1YH07-h1qKuKq1X1az2RkdLAH9yA_uI";

	const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
	
  
  
	var message = `Look at the following job description and tell me the name of the following company: ${jobDescription}
  your response should be only the company name and nothing else`;
  
  
	const body = {
	  contents: [
		{
		  parts: [
		    {
		      text: message
		    }
		  ]
		}
	  ]
	};

	fetch(url, {
	  method: "POST",
	  headers: {
		"Content-Type": "application/json"
	  },
	  body: JSON.stringify(body)
	})
	.then(res => res.json())
	.then(data => {
		console.log("Gemini response:", data);
		var text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log(text);
    document.getElementById("pdfname").value = info.name.replace(/ /g, '-') + "-" + text + ".pdf";
	})
	.catch(err => {
		console.error("Error:", err);
	});
}

function writeCoverLetter(jobDescription) {
  const apiKey = "AIzaSyCX1YH07-h1qKuKq1X1az2RkdLAH9yA_uI";

	const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
	
  
  
	var message = `Look at the following job description and write me a relevant and formal cover letter: ${jobDescription}
  here is a bit about me: ${info.aboutMe}, don't make anything up, just take the relevant points and use them. 
  your response should be less than 500 words total and not include any boiler plate that I have to fill in later, start at the main part of the letter eg. Dear ...
  your response should be able to be submitted as is, this means you must not write anything asking me to replace something eg. do not include: [Insert the platform where you saw the advertisement here]`;
  
  
	const body = {
	  contents: [
		{
		  parts: [
		    {
		      text: message
		    }
		  ]
		}
	  ]
	};

	fetch(url, {
	  method: "POST",
	  headers: {
		"Content-Type": "application/json"
	  },
	  body: JSON.stringify(body)
	})
	.then(res => res.json())
	.then(data => {
		console.log("Gemini response:", data);
		var text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log(text);
    document.getElementById("cover-letter").value = text;
	})
	.catch(err => {
		console.error("Error:", err);
	});
}




function getKeywords(jobDescription) {
  const apiKey = "AIzaSyCX1YH07-h1qKuKq1X1az2RkdLAH9yA_uI";

	const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
	
  
  
	var message = `Look at the following job description and give me the technical keywords they are looking for in a cv: ${jobDescription}
  your response should be no more than 10 words and should look similar to the following: JavaScript, TypeScript, REACT, NodeJS, SQLite.`;
  
  
	const body = {
	  contents: [
		{
		  parts: [
		    {
		      text: message
		    }
		  ]
		}
	  ]
	};

	fetch(url, {
	  method: "POST",
	  headers: {
		"Content-Type": "application/json"
	  },
	  body: JSON.stringify(body)
	})
	.then(res => res.json())
	.then(data => {
		console.log("Gemini response:", data);
		var text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log(text);
    info.keywords = text;
    document.getElementById("keywords").value = info.keywords;
	})
	.catch(err => {
		console.error("Error:", err);
	});
}


function getRelevantProjects(jobDescription) {
  const apiKey = "AIzaSyCX1YH07-h1qKuKq1X1az2RkdLAH9yA_uI";

	const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
	
  
  
	var message = `Look at the following job description and compare which projects are the most relevant to the skills required for that job: ${jobDescription}
  here are the projects: ${JSON.stringify(projectsList)}
  your response should be a list of the most relevant projects titles of the form: ["Programming Language", Code Editor", "Logic Gate Simulator", "3D Tic Tac Toe"]
  make sure your response only contains the list and that is it, don't supply any extra text aside from the [] around the list`;
  
  
	const body = {
	  contents: [
		{
		  parts: [
		    {
		      text: message
		    }
		  ]
		}
	  ]
	};

	fetch(url, {
	  method: "POST",
	  headers: {
		"Content-Type": "application/json"
	  },
	  body: JSON.stringify(body)
	})
	.then(res => res.json())
	.then(data => {
		console.log("Gemini response:", data);
		var text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log(text);
    
    var chosenProjects = [];
    var projects = JSON.parse(text);
    projects.forEach(function(project) {
      for (var i = 0; i < projectsList.length; i++) {
        if (projectsList[i].title === project) {
          chosenProjects.push(projectsList[i]);
          break;
        }
      }
    });
    
    finishSections(chosenProjects);
    
	})
	.catch(err => {
		console.error("Error:", err);
	});
  
  // finishSections();
}


function analyze() {
  document.getElementById("keywords").value = "...";
  getKeywords(document.getElementById("job-desc").value);
  getCompanyName(document.getElementById("job-desc").value);
  var exceptions = eval(document.getElementById("except").value);
  for (var i = 0; i < projectsList.length; i++) {
    if (exceptions.includes(projectsList[i].title)) {
      projectsList.splice(i, 1);
      i--;
    }
  }
  if (document.getElementById("all-projects").checked) {
    finishSections(projectsList);
  } else {
    getRelevantProjects(document.getElementById("job-desc").value);
  }
  writeCoverLetter(document.getElementById("job-desc").value);
}

function updateKeywords() {
    info.keywords = document.getElementById("keywords").value;
}


async function getImageBase64(url) {
  const response = await fetch(url, { mode: 'cors' });
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

// generateFieldsFromObject(info);
// createInput("name", info.name);
// createInput("contact", info.name);

async function generatePDF() {
  const linkImage = await getImageBase64("https://lhobson.com/images/link.png");
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const width = doc.internal.pageSize.getWidth();
  var offsetY = margin.y;
  
  function drawLinkAt(x, y) {
    //doc.addImage(linkImage, 'PNG', x-1, y-1, 8, 8);
    doc.addImage(linkImage, 'PNG', x + 1, y - 3, 4, 4);
  }
  
  // Title
  doc.setFont("times", "normal");
  doc.setFontSize(settings.headingSize);
  doc.text(info.name, Math.floor(width/2), 12 + offsetY, {align: "center"});
  
  doc.setFontSize(settings.fontSize);
  for (var i = 0; i < info.contact.length; i++) {
    if (info.contact[i].link) {
      var lineWidth = doc.getTextWidth(info.contact[i].text);
      drawLinkAt(width-margin.x - lineWidth - 8, 8 + offsetY);
      doc.textWithLink(info.contact[i].text, width-margin.x, 8 + offsetY, {align: "right", url: info.contact[i].link});
    } else {
      doc.text(info.contact[i].text, width-margin.x, 8 + offsetY, {align: "right"});
    }
    offsetY += settings.lineSpace;
  }
  
  doc.text(info.description, margin.x, 6 + offsetY);
  
  for (var i = 0; i < info.sections.length; i++) {
    var section = info.sections[i];
    doc.setDrawColor(0);
    doc.setLineWidth(0.1);
    offsetY += 8;
    doc.line(margin.x, offsetY, width - margin.x, offsetY);
    
    doc.setFontSize(settings.titleSize);
    doc.text(settings.upperTitles ? section.title.toUpperCase() : section.title, margin.x, 8 + offsetY);
    offsetY += settings.lineSpace;
    
    doc.setFontSize(settings.fontSize);
    for (var j = 0; j < section.subsections.length; j++) {
      var sub = section.subsections[j];
      var prevWidth = doc.getTextWidth(sub.title);
      if (!sub.notBold) {
        doc.setFont("times", "bold");
        prevWidth = doc.getTextWidth(sub.title) * Number(1 + 0.002 * (sub.title.match(/[roe]/gi) || []).length); // fudge factor
      }
      var move = false;
      if (sub.title) {
        if (sub.underline) {
          var textWidth = doc.getTextWidth(sub.title);
          doc.line(margin.x, 9 + offsetY, margin.x + textWidth, 9 + offsetY);
        }
        if (sub.link) {
          if (!sub.underline) {
            drawLinkAt(margin.x - 8, 8 + offsetY);
          }
          doc.textWithLink(sub.title, margin.x, 8 + offsetY, {url: sub.link});
          move = true;
        } else {
          doc.text(sub.title, margin.x, 8 + offsetY);
          move = true;
        }
      }
      if (sub.description) {
        doc.setFont("times", "italic");
        doc.text("– " + sub.description, margin.x + prevWidth + 1, 8 + offsetY);
      }
      doc.setFont("times", "normal");
      doc.text(sub.date, width-margin.x, 8 + offsetY, {align: "right"});
      if (move) {
        offsetY += settings.lineSpace;
      }
      for (var k = 0; k < sub.content.length; k++) {
        doc.setFontSize(20);
        doc.text("•", margin.x + margin.indent - 8, 9 + offsetY);
        doc.setFontSize(settings.fontSize);
        doc.text(sub.content[k], margin.x + margin.indent, 8 + offsetY);
        offsetY += settings.lineSpace;
      }
    }
    
  }
  
  // hidden text
  doc.setFontSize(0.1);
  doc.setTextColor(255, 255, 255); // White
  doc.text(info.keywords, margin.x, margin.y);
  // reset
  doc.setFontSize(settings.fontSize);
  doc.setTextColor(0, 0, 0);

//   // Body text
//   doc.setFont("times", "normal");
//   doc.setFontSize(12);
//   const paragraph = "This PDF was generated using JavaScript in the browser. It includes horizontal lines, headings, and this paragraph text to demonstrate layout formatting.";
//   doc.text(paragraph, 20, 40, { maxWidth: 170 });

//   // Another horizontal line
//   doc.line(20, 80, 190, 80);

//   // Another section
//   doc.setFontSize(14);
//   doc.setFont("helvetica", "italic");
//   doc.text("Section Two", 20, 90);

//   doc.setFontSize(12);
//   doc.setFont("times", "normal");
//   doc.text("Here is another section with its own content and a line above.", 20, 100);

  // Save the PDF
  doc.save(document.getElementById("pdfname").value);
}

async function generateCL() {
  const linkImage = await getImageBase64("https://lhobson.com/images/link.png");
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const width = doc.internal.pageSize.getWidth();
  var offsetY = margin.y + 10;
  
  function drawLinkAt(x, y) {
    //doc.addImage(linkImage, 'PNG', x-1, y-1, 8, 8);
    doc.addImage(linkImage, 'PNG', x + 1, y - 3, 4, 4);
  }
  
  var content = document.getElementById("cover-letter").value;
  
  // Title
  doc.setFont("times", "normal");
  doc.setFontSize(settings.fontSize);
  
  var lines = doc.splitTextToSize(content, width - margin.x*2);
  lines.forEach(line => {
    console.log(line, margin.x, offsetY);
    doc.text(line, margin.x, offsetY);
    offsetY += settings.lineSpace;
  });
  
  for (var i = 0; i < info.contact.length; i++) {
    if (info.contact[i].link) {
      var lineWidth = doc.getTextWidth(info.contact[i].text);
      drawLinkAt(margin.x + lineWidth + 1, offsetY);
      doc.textWithLink(info.contact[i].text, margin.x, offsetY, {align: "left", url: info.contact[i].link});
    } else {
      doc.text(info.contact[i].text, margin.x, offsetY, {align: "left"});
    }
    offsetY += settings.lineSpace;
    
  }
  

    
  doc.save("Cover-Letter" + document.getElementById("pdfname").value);
}
