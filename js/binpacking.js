var renderer, scene, camera;
var xBoite, yBoite, zBoite;
var tmpObj;

var listeObjaPlacer;
var listeObjPlaces;
var listeObjNonPlaces;
var listePointsPlacement;
var logs = "";
var volumeBoite;
var volumeTotal = 0;
var volumeRestant = 0;
var pourcen = 0;
var rend = 100;

function rotateObject(object, degreeX, degreeY, degreeZ){

   degreeX = (degreeX * Math.PI)/180;
   degreeY = (degreeY * Math.PI)/180;
   degreeZ = (degreeZ * Math.PI)/180;

   object.rotateX(degreeX);
   object.rotateY(degreeY);
   object.rotateZ(degreeZ);

}

function init(){
    // on initialise le moteur de rendu
    renderer = new THREE.WebGLRenderer();

    // si WebGL ne fonctionne pas sur votre navigateur vous pouvez utiliser le moteur de rendu Canvas à la place
    // renderer = new THREE.CanvasRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById('container').appendChild(renderer.domElement);

    // on initialise la scène
    scene = new THREE.Scene();

    // on initialise la camera que l’on place ensuite sur la scène
    camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set(50, 30, 500);
    rotateObject(camera, 0, 0, 10);

    scene.add(camera);

    /*controls = new THREE.OrbitControls( camera, renderer.domElement );
    //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;*/

    xBoite = 200;
    yBoite = 100;
    zBoite = 100;
    volumeBoite = xBoite* yBoite* zBoite;
    volumeRestant = volumeBoite;

	camera.position.x = 385;
	camera.position.y = 325;
	camera.position.z = 862;
	camera.rotation.x = -0.3300000000000001;
	camera.rotation.y = 0.38000000000000017;
	camera.rotation.z = 0.17453292519943292;

	listeObjaPlacer=[];
	listeObjPlaces=[];
	listePointsPlacement=[];
	listeObjNonPlaces=[];

	listePointsPlacement.push(new Point(0,0,0));
}

function render() {
   requestAnimationFrame(render);
   afficherListeObj();
   renderer.render(scene, camera);
}

function afficherGrille(x, y, z){
	var i, j, k;
	var material = new THREE.LineBasicMaterial({
        color: 0x999999
    });


	var geometry = new THREE.Geometry();

	geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
	geometry.vertices.push( new THREE.Vector3( x, 0, 0 ) );
	geometry.vertices.push( new THREE.Vector3( x, 0, z ) );
	geometry.vertices.push( new THREE.Vector3( 0, 0, z ) );
	geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );

	geometry.vertices.push( new THREE.Vector3( 0, y, 0 ) );

	geometry.vertices.push( new THREE.Vector3( x, y, 0 ) );
	geometry.vertices.push( new THREE.Vector3( x, 0, 0 ) );
	geometry.vertices.push( new THREE.Vector3( x, y, 0 ) );

	geometry.vertices.push( new THREE.Vector3( x, y, z ) );
	geometry.vertices.push( new THREE.Vector3( x, 0, z ) );
	geometry.vertices.push( new THREE.Vector3( x, y, z ) );

	geometry.vertices.push( new THREE.Vector3( 0, y, z ) );
	geometry.vertices.push( new THREE.Vector3( 0, 0, z ) );
	geometry.vertices.push( new THREE.Vector3( 0, y, z ) );

	geometry.vertices.push( new THREE.Vector3( 0, y, 0 ) );


	var lines = new THREE.Line(geometry, material);
	scene.add( lines );
}

function move() {
	switch(event.keyCode){
		/*haut*/	case 38: camera.position.y += 10; break;
		/*bas*/		case 40: camera.position.y -= 10; break;
		/*gauche*/	case 37: camera.position.x -= 10; break;
		/*droite*/	case 39: camera.position.x += 10; break;
		/*i*/		case 73: camera.position.z -= 10; break;
		/*o*/		case 79: camera.position.z += 10; break;

		/*z*/	case 90: camera.rotation.x += 0.01; break;
		/*s*/	case 83: camera.rotation.x -= 0.01; break;
		/*q*/	case 81: camera.rotation.y += 0.01; break;
		/*d*/	case 68: camera.rotation.y -= 0.01; break;

		/*p*/	case 80: alert(
						"px : "+camera.position.x+
						"\npy : "+camera.position.y+
						"\npz : "+camera.position.z+
						"\nrx : "+camera.rotation.x+
						"\nry : "+camera.rotation.y+
						"\nrz : "+camera.rotation.z
					);
				break;

		/*m*/	case 77:
						var mess = "Points de placement\n";
						var i = 0;
						listePointsPlacement.forEach(function(Obj){
							mess+="\npts"+i+"("+Obj.x+","+Obj.y+","+Obj.z+")";
							i+=1;
						});

						i=0;
						mess+="\n\n\nA place\n";
						listeObjaPlacer.forEach(function(Obj){
							mess+="\nbloc"+i+"("+Obj.L+","+Obj.h+","+Obj.l+")";
							i+=1;
						});

						i=0;
						mess+="\n\n\nPlaces\n";
						listeObjPlaces.forEach(function(Obj){
							mess+="\nbloc"+i+"("+Obj.L+","+Obj.h+","+Obj.l+")";
							i+=1;
						});

						i=0;
						mess+="\n\n\nNon places\n";
						for(i=0; i<listeObjNonPlaces.length; i++){
							var Obj = listeObjNonPlaces[i]
							mess+="\nbloc"+i+"("+Obj.L+","+Obj.h+","+Obj.l+")";
						}
						alert(mess);

				break;

				/*space*/	case 32: supprListeObj(); ranDims(); ajouterListeObj(); genererListeObj(); break;
				/*g*/	case 71: ranDims(); ajouterListeObj(); break;
				/*l*/	case 76: alert(logs); break;
	}
}







function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
}

function ranDims(){
	var lRand = getRandomInt(1, 40);
	var LRand = getRandomInt(1, 40);
	var hRand = getRandomInt(1, 40);

	document.getElementById('l').value = lRand;
	document.getElementById('L').value = LRand;
	document.getElementById('h').value = hRand;
}



function placerObj(bloc, point){

	var colorMat = getRandomColor();

	var geometry = new THREE.CubeGeometry( bloc.L, bloc.h, bloc.l );
    var material = new THREE.MeshBasicMaterial( { color: colorMat } );
	tmpObj = new THREE.Mesh( geometry, material );
	tmpObj.position = new THREE.Vector3(point.x+(bloc.L/2), point.y+(bloc.h/2), point.z+(bloc.l/2));

	bloc.x = point.x;
	bloc.y = point.y;
	bloc.z = point.z;
	listeObjPlaces.push(bloc);

  volumeTotal = volumeTotal + Number(bloc.volume) ;

  volumeRestant = volumeBoite- Number(volumeTotal);
  pourcen = Math.round(( volumeTotal / volumeBoite ) * 100);
  document.getElementById('perc').innerHTML = pourcen+" % de l'espace occupé";


	scene.add(tmpObj);
}

function ajouterListeObj(){
	larg=document.getElementById('l').value;
	long=document.getElementById('L').value;
	haut=document.getElementById('h').value;

	if((larg!='')&&(long!='')&&(haut!='')){
		tmpObj = new Bloc(larg, long, haut);
		listeObjaPlacer.push(tmpObj);

		afficherListeObj();
	}else{
		alert("Dimensions incorrectes.");
	}
}

function afficherListeObj(){
	var listeInnerHTML = '<tr><th>Id</th><th>Larg</th><th>Long</th><th>Haut</th><th>Coût</th></tr>';
	var i=0;

	listeObjaPlacer.forEach(function(Obj){
		listeInnerHTML+='<tr id="'+i+'" style="color:red"><td>'+i+'</td><td>'+Obj.l+'</td><td>'+Obj.L+'</td><td>'+Obj.h+'</td><td>' +Obj.volume/100+'</td></tr>';
		i+=1;
	});

  listeObjPlaces.forEach(function(Obj){
		listeInnerHTML+='<tr id="'+i+'" style="color:blue" ><td>'+i+'</td><td>'+Obj.l+'</td><td>'+Obj.L+'</td><td>'+Obj.h+'</td><td>' +Obj.volume/100+'</td></tr>';
		i+=1;

	});

  listeObjNonPlaces.forEach(function(Obj){
		listeInnerHTML+='<tr id="'+i+'" style="color:black" ><td>'+i+'</td><td>'+Obj.l+'</td><td>'+Obj.L+'</td><td>'+Obj.h+'</td><td>' +Obj.volume/100+'</td></tr>';
		i+=1;
	});

	document.getElementById('tableListeObj').innerHTML = listeInnerHTML;
}




function genererListeObj(){
	trierListeObj();

	while(listeObjaPlacer.length > 0){
		var res = findBestSolution();

	    if(res.length>0){
	      	var Obj = res[0];
	  		var Pts = res[1];

	  		placerObj(new Bloc(Obj.l, Obj.L ,Obj.h), Pts);
	    }else{
	    	logs+="\nFin du placement des blocs.";
	    }
	}
}

function findBestSolution(){
	var bloc;
	var point;

	//Parcours des points de placement
	var found = false;
	var i = -1;
	var j = -1;

	while (!found){
		i++;

		if(i>=listePointsPlacement.length){
			logs += "\n-- plus de points disponibles.";

			listeObjaPlacer.forEach(function(Obj){
				logs += "\n-- bloc ("+Obj.L+","+Obj.h+","+Obj.l+") non placé.";
				listeObjNonPlaces.push(Obj);
	    	});

	    	listeObjaPlacer = [];
      		break;
		}

		var cur_pts = listePointsPlacement[i];
		logs += "\n-- test point "+i+"/"+listePointsPlacement.length+" ("+cur_pts.x+","+cur_pts.y+","+cur_pts.z+")";


		//Recherche du meilleur bloc à placer sur ce point
		j = -1;
		while (!found){
			j++;

			if(j>=listeObjaPlacer.length){
				logs += "\n------ plus de blocs disponibles.";
				break;
			}

			var cur_blc = listeObjaPlacer[j];
			logs += "\n------ test bloc "+j+" ("+cur_blc.L+","+cur_blc.h+","+cur_blc.l+")";

			cur_blc.rotate1();
			if(isMatching(cur_blc, cur_pts)){ logs += "\n------ ok."; bloc = cur_blc; point = cur_pts; found = true;}
			else{
				cur_blc.rotate2();
				if(isMatching(cur_blc, cur_pts)){ logs += "\n------ ok."; bloc = cur_blc; point = cur_pts; found = true;}
				else{
					cur_blc.rotate3();
					if(isMatching(cur_blc, cur_pts)){ logs += "\n------ ok."; bloc = cur_blc; point = cur_pts; found = true;}
					else{
						cur_blc.rotate4();
						if(isMatching(cur_blc, cur_pts)){ logs += "\n------ ok."; bloc = cur_blc; point = cur_pts; found = true;}
						else{
							cur_blc.rotate5();
							if(isMatching(cur_blc, cur_pts)){ logs += "\n------ ok."; bloc = cur_blc; point = cur_pts; found = true;}
							else{
								cur_blc.rotate6();
								if(isMatching(cur_blc, cur_pts)){ logs += "\n------ ok."; bloc = cur_blc; point = cur_pts; found = true;}
							}
						}
					}
				}
			}
		}
	}

	//Mise à jour des blocs à placer

	var res = [];

  if(found){
    listePointsPlacement.push(new Point(point.x+Number(bloc.L), point.y, point.z));
  	listePointsPlacement.push(new Point(point.x, point.y, point.z+Number(bloc.l)));
  	listePointsPlacement.push(new Point(point.x+Number(bloc.L), point.y, point.z+Number(bloc.l)));

  	listePointsPlacement.push(new Point(point.x+Number(bloc.L), point.y+Number(bloc.h), point.z));
  	listePointsPlacement.push(new Point(point.x, point.y+Number(bloc.h), point.z+Number(bloc.l)));
  	listePointsPlacement.push(new Point(point.x+Number(bloc.L), point.y+Number(bloc.h), point.z+Number(bloc.l)));
  	listePointsPlacement.push(new Point(point.x, point.y+Number(bloc.h), point.z));

  	listePointsPlacement.splice(i, 1);
  	trierPointPlacement();

    listeObjaPlacer.splice(j, 1);
  	logs+="\nPlacement du bloc ("+bloc.L+","+bloc.h+","+bloc.l+") en ("+point.x+","+point.y+","+point.z+")\n";
  	trierListeObj();

    res = [bloc, point];
  }else{
    res = [];
  }

  if((listeObjPlaces.length+listeObjNonPlaces.length)>0) var rend = (listeObjPlaces.length/(listeObjPlaces.length+listeObjNonPlaces.length))*100;
  document.getElementById('nbb').innerHTML = (listeObjPlaces.length+listeObjNonPlaces.length)+" blocs traités";
  document.getElementById('nbbp').innerHTML = listeObjPlaces.length+" blocs placés";
  document.getElementById('nbbnp').innerHTML = listeObjNonPlaces.length+" blocs abandonnés";
  document.getElementById('rend').innerHTML = "Rendement : "+Math.round(rend)+" %";

  return res;
}

function isMatching(bloc, point){
	var x_limit = point.x+Number(bloc.L);
	var y_limit = point.y+Number(bloc.h);
	var z_limit = point.z+Number(bloc.l);

	if(x_limit>xBoite){ logs += "\n---------- intersect xLimit("+xBoite+")"; return false; }
	else if (y_limit>yBoite){ logs += "\n---------- intersect yLimit("+yBoite+")"; return false; }
	else if (z_limit>zBoite){ logs += "\n---------- intersect zLimit("+zBoite+")"; return false; }
	else{
		var intersect = false;
		listeObjPlaces.forEach(function(Obj){
			if(Obj.intersect(bloc, point)){
				intersect = true;
				logs += "\n---------- intersect ("+Obj.L+","+Obj.h+","+Obj.l+") en ("+Obj.x+","+Obj.y+","+Obj.z+")";
			}
		});

		if(intersect) return false;
		else return true;
	}
}

function trierListeObj(){

	listeObjaPlacer.sort(function(a,b){return b.volume - a.volume});
	afficherListeObj();
}

function trierPointPlacement(){
	listePointsPlacement.sort(function(a,b){
		return a.fullInt - b.fullInt;
	});
}

function supprListeObj(){
	listeObjaPlacer=[];
	afficherListeObj();
}

function lireFichierListeObj(){
	var reader = new FileReader();
	var fileInput = document.querySelector('#file');

	reader.onload = function(e) {
	    var content=String(reader.result);
	    var objets=content.split('\n');
	    objets.forEach(function(objet){
			var dims = objet.split(';');
			listeObjaPlacer.push(new Bloc(dims[0],dims[1],dims[2]));
		});
		afficherListeObj();
	};

	reader.readAsText(fileInput.files[0]);

}

/*function animate() {
        requestAnimationFrame( animate );
        controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
        renderer.render( scene, camera );
}*/

init();
//animate();
afficherGrille(xBoite, yBoite, zBoite);
afficherListeObj();
render();
document.onkeydown = move;
