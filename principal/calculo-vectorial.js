// Función para sumar dos vectores
function sumaVectores(v1, v2) {
    if (v1.length !== v2.length) {
      throw new Error('Los vectores deben tener la misma longitud');
    }
  
    const resultado = [];
    for (let i = 0; i < v1.length; i++) {
      resultado.push(v1[i] + v2[i]);
    }
  
    return resultado;
  }
  
  // Función para calcular el producto cruz de dos vectores en R3
  function productoCruz(v1, v2) {
    if (v1.length !== 3 || v2.length !== 3) {
      throw new Error('Los vectores deben tener longitud 3 para calcular el producto cruz');
    }
  
    const resultado = [];
    resultado.push(v1[1] * v2[2] - v1[2] * v2[1]);
    resultado.push(v1[2] * v2[0] - v1[0] * v2[2]);
    resultado.push(v1[0] * v2[1] - v1[1] * v2[0]);
  
    return resultado;
  }
  
  // Ejemplo de uso de las funciones
  const vector1 = [1, 2, 3];
  const vector2 = [4, 5, 6];
  
  try {
    const resultadoSuma = sumaVectores(vector1, vector2);
    console.log('La suma de los vectores es:', resultadoSuma);
  
    const resultadoProductoCruz = productoCruz(vector1, vector2);
    console.log('El producto cruz de los vectores es:', resultadoProductoCruz);
  } catch (error) {
    console.error('Error:', error.message);
  }