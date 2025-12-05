import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ mode: configMode }) => {
  // 自定义mode处理：如果没有指定mode，默认使用'development'
  const mode = configMode || 'development';
  
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  
  // 根据mode进行不同的配置逻辑
  const isDev = mode === 'development';
  const isProd = mode === 'production';
  const isStaging = mode === 'staging';
  
  // 输出当前环境信息
  console.log('当前环境模式:', mode);
  console.log('环境变量:', env);
  console.log('是否开发环境:', isDev);
  console.log('是否生产环境:', isProd);
  console.log('是否测试环境:', isStaging);
  
  return {
    root: '.',
    build: {
      outDir: '../dist',
      emptyOutDir: true,
      // 多页面应用配置
      rollupOptions: {
        input: './index.html'
      },
    },
    server: {
      // 根据不同mode设置不同的服务器配置
      host: isProd ? '0.0.0.0' : '192.168.1.159',
      port: isProd ? 80 : isStaging ? 8889 : 8888,
    },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, 'src'),
      },
    },
    plugins: [
      vue({}),
      tailwindcss(),
    ],
  };
});