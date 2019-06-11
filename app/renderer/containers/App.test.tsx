import pako from 'pako';

describe('Enzyme Shallow', () => {
    it('decompress', () => {
        const punzipstr = 'H4sIAAAAAAAAAKtWSs/JT0rM8UxRslIyNDFX0lFKT813TixJTc8vqgSLGgPF' +
            '8hJzU4HM58uXPZ/V/nTTbKBQWmlOjh+a8NMdTUCZVKhwYGZeRmliXnpKYj5I1A2hQalWhwsA0ps4IXoAAAA=';
        console.log(atob(punzipstr));
        const a = pako.ungzip(atob(punzipstr), { to: 'string' } );
        console.log(a);
    });
    it('encompress', () => {
        const punzipstr = '{"globalId":"147","geoCategoryId":"3","name":"秦皇岛",' +
            '"fullName":"秦皇岛市","eName":"Qinhuangdao","eFullName":""},\n';
        const a = pako.gzip(punzipstr, { to: 'string' } );
        console.log(a);
        console.log(btoa(a));
    });
});
