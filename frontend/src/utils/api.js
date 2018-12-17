const url = "http://localhost:3001/"

const headers = {
    'Authorization': 'whatever-you-want',
    'Content-Type': 'application/json'
}

export function getPosts(){
    fetch(`${url}/posts`,
        {headers: headers}
    )
    .then(res => res.json()).then(data => data)
    .then(res => console.log(res))
} 
 
export function buscarCategorias(){
    fetch(`${url}/categories`,
        { headers }
    )
    .then(res => res.json())
    .then(data => data.categories)
}
  
