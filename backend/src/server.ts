import app from './app';
import { checkDbConnection } from './config/db';

const PORT = process.env.PORT || 3000;

async function startServer() {
    await checkDbConnection();
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

startServer();
