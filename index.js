const mongoose = require("mongoose")
const app = require("./app")
var controlador = require("./src/controladores/maestro.controlador")



mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/controlAlumno2019010', {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log('se encuentra conectado a la base de datos');
    
      controlador.Mdefault();

    app.listen(3000, function() {
        console.log('El servidor esta arrancando en el puerto 3000')
       
        
    })
}).catch(err => console.log(err))