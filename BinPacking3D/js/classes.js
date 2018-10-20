class Point {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.fullInt = (this.y*100000)+(this.z*1000)+(this.x*10);
  }
}

class Bloc {
  constructor(l, L, h) {
    this.l = l;
    this.L = L;
    this.h = h;
    this.tmp = [L, h, l];
    this.tmp.sort(function(a,b){return a - b});
    this.volume = l*L*h;
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }

  rotation(){
    var tmp = 0;
    var l = this.l;
    var L = this.L;
    var h = this.h;

    var aire1 = l*L;
    var aire2 = h*l;
    var aire3 = h*L;

    var maxAire = Math.max(aire1, aire2, aire3);

    switch(maxAire){
      case aire1:
      break;

      case aire2:
       tmp = L;
        L = l;
        l = tmp;
        tmp=h
        h = l;
        l = tmp;
      break;

      case aire3:
        tmp = l;
        l = h;
        h = tmp;
      break;
    }

    this.l = l;
    this.L = L;
    this.h = h;
  }

  intersect(bloc, point){
    var x_limit = point.x+Number(bloc.L);
    var y_limit = point.y+Number(bloc.h);
    var z_limit = point.z+Number(bloc.l);

    var this_x_limit = this.x+Number(this.L);
    var this_y_limit = this.y+Number(this.h);
    var this_z_limit = this.z+Number(this.l);

 
    return (point.x < this_x_limit && x_limit > this.x)
      && (point.y < this_y_limit && y_limit > this.y)
      && (point.z < this_z_limit && z_limit > this.z);
  }

  rotate1(){
    this.L = this.tmp[1];
    this.h = this.tmp[0];
    this.l = this.tmp[2];
  }

  rotate5(){
    this.L = this.tmp[2];
    this.h = this.tmp[1];
    this.l = this.tmp[0];
  }

  rotate4(){
    this.L = this.tmp[0];
    this.h = this.tmp[2];
    this.l = this.tmp[1];
  }

  rotate6(){
    this.L = this.tmp[2];
    this.h = this.tmp[0];
    this.l = this.tmp[1];
  }

  rotate2(){
    this.L = this.tmp[1];
    this.h = this.tmp[2];
    this.l = this.tmp[0];
  }

  rotate3(){
    this.L = this.tmp[0];
    this.h = this.tmp[1];
    this.l = this.tmp[2];
  }

}