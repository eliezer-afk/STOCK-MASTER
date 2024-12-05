import request from "supertest";
import server from "../server";
import { connectDB } from "../server";
import db from "../config/db";
import http from 'http';

let serverInstance: http.Server;

beforeAll(() => {
    serverInstance = server.listen(4000); // Guarda la referencia al servidor HTTP
});

describe('GET /api', () => {
    it('should send back a json response', async () => {
        const res = await request(serverInstance).get('/api');
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/json/);
        expect(res.body.msg).toBe('Desde API');
    });
});

describe('connectDB', () => {
    it('should handle database connection error', async () => {
        jest.spyOn(db, 'authenticate') //creamos el spy (lo que observa)
            .mockRejectedValueOnce(new Error('Hubo un error al conectar a la BD'));
        try {
            await connectDB();
        } catch (error) {
            expect(error.message).toBe('Hubo un error al conectar a la BD');
        }
    });
});

// Asegúrate de cerrar el servidor y la conexión a la base de datos después de las pruebas
afterAll(async () => {
    await serverInstance.close(); // Cierra el servidor HTTP
    // Cierra la conexión a la base de datos si es necesario
});