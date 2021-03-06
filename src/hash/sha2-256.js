// SHA-2 256 (c) 2006 The Internet Society
(function () {
  var merge = mergeMost_32,
      split = splitMost_32,
      rotr = rotr_32,
      
      K = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
        0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
        0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
        0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
        0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
        0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
        0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
        0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
        0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
      ];
    
  function bSig0( x ) {
    return rotr( x,  2 ) ^ rotr( x, 13 ) ^ rotr( x, 22 );
  }
  function bSig1( x ) {
    return rotr( x,  6 ) ^ rotr( x, 11 ) ^ rotr( x, 25 );
  }
  function sSig0( x ) {
    return rotr( x,  7 ) ^ rotr( x, 18 ) ^ ( x >>> 3 );
  }
  function sSig1( x ) {
    return rotr( x, 17 ) ^ rotr( x, 19 ) ^ ( x >>> 10 );
  }
  
  function ch( x, y, z ) {
    return ( x & y ) ^ ( ( ~x ) & z );
  }
  function maj( x, y, z ) {
    return ( x & y ) ^ ( x & z ) ^ ( y & z );
  }
  
  function sha2_32( digest, data ) {
    var a, b, c, d, e, f, g, h, i, l, t, tmp1, tmp2, w, x,
        bytes = data.length,
        padding = [ 0x80 ],
        part = Math.ceil( digest / 32 ),
        hash = {
          224: [
            0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
            0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4
          ],
          256: [
            0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
            0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
          ]
        }[digest];
    
    padding.length = ( ( bytes % 64 ) < 56 ? 56 : 120 ) - ( bytes % 64 );
    
    x = merge( data.concat( padding ) ).concat([
      ( bytes * 8 / Math.pow( 2, 32 ) ) | 0x0,
      ( bytes * 8 ) | 0x0
    ]);
    
    // update hash
    for ( i = 0, w = [], l = x.length; i < l; i += 16 ) {
      a = hash[0] | 0x0;
      b = hash[1] | 0x0;
      c = hash[2] | 0x0;
      d = hash[3] | 0x0;
      e = hash[4] | 0x0;
      f = hash[5] | 0x0;
      g = hash[6] | 0x0;
      h = hash[7] | 0x0;
      
      for ( t = 0; t < 64; t += 1 ) {
        if ( t < 16 ) {
          w[t] = x[ i + t ];
        } else {
          w[t] = sSig1( w[t - 2] ) + w[t - 7] + sSig0( w[t - 15] ) + w[t - 16];
        }
        
        tmp1 = h + bSig1( e ) + ch( e, f, g ) + K[t] + w[t];
        tmp2 = bSig0( a ) + maj( a, b, c );
        h = g;
        g = f;
        f = e;
        e = d + tmp1;
        d = c;
        c = b;
        b = a;
        a = tmp1 + tmp2;
      }
      
      hash[0] += a;
      hash[1] += b;
      hash[2] += c;
      hash[3] += d;
      hash[4] += e;
      hash[5] += f;
      hash[6] += g;
      hash[7] += h;
    }
    
    return split( hash.slice( 0, part ) );
  }
  
  function sha224( data ) {
    return sha2_32( 224, data );
  }
  
  function sha256( data ) {
    return sha2_32( 256, data );
  }
  
  self.sha224 = factorMAC( hmac, sha224, 224, 64 );
  
  self.sha256 = factorMAC( hmac, sha256, 256, 64 );
  
}());
