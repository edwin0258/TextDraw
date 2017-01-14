let TextDraw = {
  init: function() {
    let canvas = [];
    let width = 0;
    let height = 0;
    let color = "black"
    //Master functions
    function createCanvas(x,y) {
      width = x;
      height = y;
      canvas = [...Array(height)].map(x => [...Array(width)].map(x => " "));
    }
    
    function drawCanvas() {
      return canvas.map(x => x.join('')).join(" \n");
    }
    
    function getContent(x, y) {
      var div = document.createElement('div');
      div.innerHTML = canvas[y - 1][x - 1];
      return div.innerText;
    }
    
    function logCanvas() {
      //remove span tags from all characters.
      let c = canvas.map((row,y) => row.map((char,x) => getContent(x + 1,y + 1)));
      return c.map(x => x.join('')).join(" \n");
    }
    
    function validPosition(x = 1, y = 1, w = 1, h = 1) {
      w -=1; //Since a width or height of 1 will place exactly on x or y
      h -=1;
      if(x <= width   &&
         y <= height  &&
         x > 0        &&
         y > 0) {
          if(x + w <= width &&
             y + h <= height &&
             w >= 0 &&
             h >= 0){
               return true;
             } else {
               throw Error("Positioning in canvas invalid. Width: " + (w+1) + " Height: " + (h+1) + " goes outside canvas."); 
             }
         } else {
           throw Error("Positioning in canvas invalid. Row: " + y + " Column: " + x + " not found");
         }
    }
    
    function pack(chars,color = "black") {
      //package characters for placing on canvas.
      return "<span style='color:" + color + "'>" + chars + "</span>";
    }
    
    //Drawing types
    let line = {
      character: "@",
      char_count: 4, //length of line
      color: "black", //color of line
      x_pos: 0,
      y_pos: 0,
      draw: function(char = "@", l = 4, y = 1, x = 1, obj = {vertical: false, color: "black"}) {
        //DRAW - character, length, y_position, x_position
        function init() {
          //defaults of specific object keys.
          obj.vertical = obj.vertical || false;
          this.character = char;
          this.char_count = l;
          if(obj.vertical) {
            //vertical line validator
            validPosition(x,y,1,l)
          } else {
            //horizontal line validator
            validPosition(x,y,l)
          }
          this.color = obj.color || "black";
          this.x_pos = x - 1; // row 2 will be row 2 instead of row 3.
          this.y_pos = y - 1;
        }
        
        
        function place() {
          if(obj.vertical === false) {
            canvas[this.y_pos].splice(this.x_pos,this.char_count - 1);
            canvas[this.y_pos][this.x_pos] = [...Array(this.char_count)].map(i => {
              return pack(this.character, this.color)
            });
            canvas[this.y_pos] = [].concat.apply([],canvas[this.y_pos])
          } else {
            for(z = 0; z < this.char_count; z++) {
              canvas[this.y_pos + z][this.x_pos] = pack(this.character,this.color)
            }
          }
        }
        
        init.apply(this);
        place.apply(this);
      }
    }
    
    let square = {
      character: "@",
      square_width: 4,
      square_height: 4,
      color: "black",
      x_pos: 0,
      y_pos: 0,
      draw: function(char = "@", w = 4, h = 4, y = 1, x = 1, obj = {color: "black"}) {
        //DRAW - character, width, height, y_position, x_position
        function init() {
          this.character = char;
          this.color = obj.color;
          this.square_width = w;
          this.square_height = h;
          validPosition(x,y,w,h);
          this.x_pos = x;
          this.y_pos = y;
        }
        
        function place() {
          console.log(this.character,this.square_height,this.square_width,this.color,this.x_pos,this.y_pos)
          for(z = 0; z < this.square_height; z++) {
            line.draw(this.character,this.square_width,this.y_pos + z,this.x_pos,{color: this.color});
          }
        }
        
        init.apply(this);
        place.apply(this);
      }
    }
    
    let text = {
      characters: "",
      color: "black",
      x_pos: 0,
      y_pos: 0,
      draw: function(chars = "", x = 1, y = 1, obj = {color: "black"}) {
        //DRAW characters in text, x_position, y position
        function init() {
          this.characters = chars;
          this.color = obj.color || "black";
          this.x_pos = x - 1;
          this.y_pos = y - 1;
        }
        
        function place() {
          canvas[this.y_pos].splice(this.x_pos,this.characters.length - 1);
          canvas[this.y_pos][this.x_pos] = this.characters.split('').map(x => {
            return pack(x, this.color)
          });
          console.log(canvas[this.y_pos][this.x_pos])
          canvas[this.y_pos] = [].concat.apply([],canvas[this.y_pos]);
        }
        
        init.apply(this);
        place.apply(this);
      }
    }
    
    let point = {
      character: "@",
      color: "black",
      x_pos: 0,
      y_pos: 0,
      draw: function(char = "@", x = 1, y = 1, obj = {color: "black"}) {
        //DRAW character, x_position, y_position
        function init() {
          this.character = char;
          this.color = obj.color || "black";
          this.x_pos = x - 1;
          this.y_pos = y - 1;
        }
        
        function place() {
          canvas[this.y_pos][this.x_pos] = pack(this.character, this.color);
        }
        
        init.apply(this);
        place.apply(this);
      }
    }
    
    //Public API
    return {
      line,
      square,
      text,
      point,
      createCanvas,
      drawCanvas,
      getContent,
      logCanvas
    }
  }
}
