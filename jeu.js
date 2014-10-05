$(document).ready(function() {
	
	var canvas = document.getElementById('jeu');
    var contexte = canvas.getContext('2d');
	
	/* Variables de jeu */
	var positionRaquette = 800/2 - 100/2;
	
	var balleX = positionRaquette + 100/2 - 20/2;
	var balleY = 600-20-20-20;
	var balleAngle = 90;
	var balleVitesse = 5;
	
	var gauche = false;
	var droite = false;
	
	var vitesse = 8;
	
	var commence = false;
	
	var bc = {};
	
	var briques = {};

	var triche = false;
	
	var pause = false;
	
	var briqueRest = 78;
	/* */
	
	deg2rad = function(d) {
		return (d/180) * Math.PI;
	};
	
	rad2deg = function(r) {
		return (r/Math.PI) * 180;
	};
	
	/* Event souris */
	$('body').click(function(e) {
		x = e.clientX;
		y = e.clientY;
		
		briqueX = Math.floor((x+10-25)/56);
		briqueY = Math.floor((y+10-15)/26);
		
		if(briques[briqueX] && briques[briqueX][briqueY] == 1) {
			briques[briqueX][briqueY] = 0;
			briqueRest--;
		}
	});
	/* */
	
	/* Event clavier */
	$('body').keydown(function(e) {
		keyCode = e.keyCode;
		// Gauche
		if(keyCode == 37) {
			gauche = true;
		}
		// Droite
		else if(keyCode == 39) {
			droite = true;
		}
		// Espace
		else if(keyCode == 32) {
			commence = true;
		}
		// triche
		else if(keyCode == 84) {
			triche = !triche;
		}
		// Pause
		else if(keyCode == 80) {
			pause = !pause;
		}
	});
	
	$('body').keyup(function(e) {
		keyCode = e.keyCode;
		
		// Gauche
		if(keyCode == 37) {
			gauche = false;
		}
		// Droite
		else if(keyCode == 39) {
			droite = false;
		}
	});
	/* */
	
	for(x = 0; x < 13; x++) {
		bc[x] = {};
		briques[x] = {};
		for(y = 0; y < 6; y++) {
			bc[x][y] = {};
			bc[x][y][0] = Math.floor((Math.random() * 255) + 0);
			bc[x][y][1] = Math.floor((Math.random() * 255) + 0);
			bc[x][y][2] = Math.floor((Math.random() * 255) + 0);
			
			briques[x][y] = 1;
		}
	}
	
	// Boucle de jeu
	setInterval(function() {
		contexte.clearRect(0, 0, 800, 600);
		if(!pause) {
			/* Mouvement de la raquette */
			if(gauche) {
				positionRaquette -= vitesse;
				if(!commence && positionRaquette > 0)
					balleX -= vitesse;
			}
			else if(droite) {
				positionRaquette += vitesse;
				
				if(!commence && positionRaquette < 800-100)
					balleX += vitesse;
			}

			if(triche)
				positionRaquette = balleX-50+10;
			
			if(positionRaquette < 0)
				positionRaquette = 0;
			if(positionRaquette > 800-100)
				positionRaquette = 800-100;
			/* */
			
			/* Mouvement de la balle */
			if(commence) {
				balleX += Math.cos(deg2rad(balleAngle)) * balleVitesse;
				balleY -= Math.sin(deg2rad(balleAngle)) * balleVitesse;
			}
			
			// La balle touche le haut
			if(balleY < 0) {
				balleY = 0;
				
				if(Math.cos(deg2rad(balleAngle)) < 0)
					dBas = true;
				else
					dBas = false;
				
				
				balleAngle = rad2deg(Math.asin(-Math.sin(deg2rad(balleAngle))));
				
				if(dBas)
					balleAngle = 180 - balleAngle;
			}
				
			// La balle touche à droite
			if(balleX > 800-20) {
				balle = 800-20;
				
				if(Math.sin(deg2rad(balleAngle)) < 0)
					dDroite = true;
				else
					dDroite = false;
					
				balleAngle = rad2deg(Math.acos(-Math.cos(deg2rad(balleAngle))));
				
				if(dDroite)
					balleAngle *= -1;
			}
			
			// La balle touche à gauche
			if(balleX < 0) {
				balleX = 0;
				
				if(Math.sin(deg2rad(balleAngle)) < 0)
					dGauche = true;
				else
					dGauche = false;
				
				balleAngle = rad2deg(Math.acos(-Math.cos(deg2rad(balleAngle))));
				
				if(dGauche)
					balleAngle *= -1;
			}
			
			// La balle tombe
			if(balleY > 600) {
				alert('PERDU !');
				document.location.href= "index.html";
			}
			
			// Si la balle touche la raquette
			if(balleY > 540) { // Dans la hauteur de la raquette
				if(balleX+20 > positionRaquette && balleX < positionRaquette+100) {
					balleY = 540;
					balleAngle = rad2deg(Math.asin(-Math.sin(deg2rad(balleAngle))));
					
					pourcentage = 1-((((balleX+10) - (positionRaquette+50)))/50);
				
					if(pourcentage < 0) {
						pourcentage *= -1;
						addOn += 90;
					}
					else if(pourcentage == 0) {
						balleAngle = 90;
					}
					else if(pourcentage > 0)
						addOn = 1;
						
					balleAngle *= pourcentage;
					balleAngle += addOn;

					// Si l'angle est trop grand ou trop petit
					if(balleAngle < 30)
						balleAngle = 30;
					else if(balleAngle > 150)
						balleAngle = 150;
				}
				
			}
			/* */
			
			/* On affiche les briques */
			for(x = 0; x < 13; x++) {
				for(y = 0; y < 6; y++) {
					if(briques[x][y] == 1) {
						contexte.fillStyle = 'rgb(' + bc[x][y][0] + ', ' + bc[x][y][1] + ', ' + bc[x][y][2] + ')';
						contexte.fillRect(x*50+x*5+40, y*20+y*5+15, 50, 20);
						
						/*contexte.font= "15px Arial";
						contexte.fillStyle = 'rgb(' + (255-bc[x][y][0]) + ', ' + (255-bc[x][y][1]) + ', ' + (255-bc[x][y][2]) + ')';
						contexte.fillText(x + ';' + y, x*50+x*5+40+17, y*20+y*5+15+15);*/
					}
				}
			}
			/* */
			
			/* Gestion des collisions avec les briques */
			// Meme largeur que les briques
			if(balleX+20 > 40 && balleX < 13*50*13*5+40) {
				// Meme hauteur que les briques
				if(balleY+20 > 15 && balleY < 6*20+6*5+15) {
					
					briqueX = Math.floor((balleX+10-25)/56);
					briqueY = Math.floor((balleY+10-15)/26);
					
					if(briques[briqueX] && briques[briqueX][briqueY] == 1) {
						balleAngle = rad2deg(Math.asin(-Math.sin(deg2rad(balleAngle))));
						briques[briqueX][briqueY] = 0;
						briqueRest--;
					}
				}
			}
			
			nbZero = 0;
			for(i = 0; i < 13; i++) {	
				for(j = 0; j < 6; j++) {
					if(briques[i][j] == 0)
						nbZero++;
					
				}
			}
			if(nbZero == 13*6) {
				alert("T'a gagné !");
				document.location.href= "index.html";
			}
			/* */
			
			// On affiche la raquette
			contexte.fillStyle = '#2980b9';
			contexte.fillRect(positionRaquette, 560, 100, 20);
				
			// On affiche la balle
			contexte.fillStyle = '#ffffff';
			contexte.fillRect(balleX, balleY, 20, 20);
			
			// On affiche le score
			contexte.font= "10px Arial";
			contexte.fillStyle = '#ffffff';
			contexte.fillText(briqueRest + ' / 78', positionRaquette+35, 573);
		}
		// En pause
		else {
			contexte.font= "60px Arial";
			contexte.fillStyle = '#ffffff';
			contexte.fillText('C\'est la PAUSE FDP !', 10, 200);
		}
	}, 10);
	
});