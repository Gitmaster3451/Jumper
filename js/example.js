//Initializing the engine
let engine = new Engine("Engine", 300, 300, 60, true);

//Update function
function update() {
    //This code will run before every draw occures
}

//Late update function
function lateUpdate() {
    //This code will run after every draw occures
}

//Binds the functions to the engine
engine.bindUpdate(update);
engine.bindLateUpdate(lateUpdate);