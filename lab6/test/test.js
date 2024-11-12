import { expect } from 'chai';
import request  from 'supertest';

const url = "https://gorest.co.in/public/v2";
const token = ;//"Enter your token"; 
let niki
let nikiupdate

describe('gorest api test', () => {
    after(async () => {
        /*const Niki = await request(url)
            .get('/users?name=Niki&email=fakemail@gmail.com')
            .set("Authorization", "Bearer "+ token)

        const Niki2 = await request(url)
            .get('/users?name=Niki2&email=freakemail2@gmail.com')
            .set("Authorization", "Bearer "+ token)
*/
        // me trying to clear the mess
        await request(url)
            .delete('/users/' + niki)
            .set("Authorization", "Bearer "+ token)

        await request(url)
            .delete('/users/' + nikiupdate)
            .set("Authorization", "Bearer "+ token)
        
    });


    it('Create a new user ', async () => {
        const response = await request(url)
            .post('/users')
            .set("Authorization", "Bearer "+ token)
            .send({
                "name":"Niki", 
                "gender":"male", 
                "email":"fakemail@gmail.com", 
                "status":"active"
            });

        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('id');
        expect(response.body.name).to.equal('Niki');
        expect(response.body.gender).to.equal('male');
        expect(response.body.email).to.equal('fakemail@gmail.com');
        expect(response.body.status).to.equal('active');

        niki = response.body.id
    });

    it('Get user details', async () => {
        const response = await request(url)
        .get('/users/7516640')
        .set("Authorization", "Bearer "+ token)

        expect(response.status).to.equal(200)
        expect(response.body).to.be.an('Object')
        expect(response.body).to.deep.equal({
            "id": 7516640,
            "name": "Prasad Nambeesan",
            "email": "prasad_nambeesan@abbott.test",
            "gender": "male",
            "status": "inactive"
          })
    });
    it('get users', async () => {
        const response = await request(url)
            .get('/users?per_page=50')
            .set("Authorization", "Bearer "+ token)
        
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.equal(50);


    });
    it('update user', async () => {
        
        const response = await request(url)
            .post('/users')
            .set("Authorization", "Bearer "+ token)
            .send({
                "name":"NikiUpdate", 
                "gender":"male", 
                "email":"fakemail2@gmail.com", 
                "status":"active"
            });

        expect(response.status).to.equal(201);

        const response2 = await request(url)
        .put('/users/'+response.body.id)
        .set("Authorization", "Bearer "+ token)
        .send({
            "name":"Niki2", 
            "status":"inactive"
        })
        .expect(200)
        .then((response) => {
            expect(response.body).to.deep.equal({
                id:response.body.id,
                name:"Niki2",
                email:"fakemail2@gmail.com",
                gender:"male",
                status:"inactive"
            })
        })

        nikiupdate = response.body.id

    });
    it('delete user', async () => {
        const response = await request(url)
            .post('/users')
            .set("Authorization", "Bearer "+ token)
            .send({
                "name":"NikiDelete", 
                "gender":"male", 
                "email":"fakemail3@gmail.com", 
                "status":"active"
            });
            
            expect(response.status).to.equal(201);

        const response2 = await request(url)
            .delete('/users/'+response.body.id)
            .set("Authorization", "Bearer "+ token)
            
            expect(response2.status).to.equal(204);

        const check = await request(url)
            .get('/users/'+response.body.id)
            .set("Authorization", "Bearer "+ token)
            
            expect(check.status).to.equal(404);

    });
    
});