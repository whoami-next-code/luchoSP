const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuración inmutable
const CONFIG = {
  frontend: { path: 'frontend', port: 3000, url: 'http://localhost:3000' },
  backend: { path: 'backend', port: 3001, url: 'http://localhost:3001' },
  admin: { path: 'admin', port: 3002, url: 'http://localhost:3002' }
};

// Verificación de integridad
function verifyIntegrity() {
  console.log('🔒 Verificando integridad del entorno...');
  
  // Verificar backend main.ts
  const mainTsPath = path.join(__dirname, 'backend', 'src', 'main.ts');
  const mainTsContent = fs.readFileSync(mainTsPath, 'utf8');
  if (!mainTsContent.includes('await app.listen(3001)')) {
    console.error('❌ ALERTA DE SEGURIDAD: El puerto del backend ha sido modificado.');
    process.exit(1);
  }

  // Verificar package.json de frontend y admin
  const verifyPackage = (dir, port) => {
    const pkgPath = path.join(__dirname, dir, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    if (!pkg.scripts.dev.includes(`-p ${port}`)) {
      console.error(`❌ ALERTA DE SEGURIDAD: El puerto de ${dir} ha sido modificado.`);
      process.exit(1);
    }
  };

  verifyPackage('frontend', 3000);
  verifyPackage('admin', 3002);

  console.log('✅ Integridad verificada. Iniciando servicios...');
}

// Iniciar servicios
function startServices() {
  const concurrently = require('concurrently');

  const { result } = concurrently(
    [
      { 
        command: 'npm run dev --prefix frontend', 
        name: 'FRONTEND', 
        prefixColor: 'blue' 
      },
      { 
        command: 'npm run start:dev --prefix backend', 
        name: 'BACKEND', 
        prefixColor: 'yellow' 
      },
      { 
        command: 'npm run dev --prefix admin', 
        name: 'ADMIN', 
        prefixColor: 'magenta' 
      }
    ],
    {
      prefix: 'name',
      killOthers: ['failure', 'success'],
      restartTries: 3,
    }
  );

  result.then(
    () => console.log('Todos los servicios se detuvieron exitosamente.'),
    (err) => console.error('Error en los servicios:', err)
  );
}

// Ejecución
try {
  verifyIntegrity();
  startServices();
} catch (error) {
  console.error('❌ Error fatal al iniciar:', error.message);
  // Intentar instalar dependencias si faltan
  if (error.code === 'MODULE_NOT_FOUND') {
    console.log('📦 Instalando dependencias del sistema de arranque...');
    const install = spawn('npm', ['install'], { stdio: 'inherit', shell: true });
    install.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Dependencias instaladas. Reiniciando...');
        startServices(); // Reintentar (puede fallar si require no se actualiza, pero es un intento)
      } else {
        process.exit(code);
      }
    });
  }
}
