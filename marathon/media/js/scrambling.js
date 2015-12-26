/*

 scramble_333.js

 3x3x3 Solver / Scramble Generator in Javascript.

 The core 3x3x3 code is from a min2phase solver by Shuang Chen.
 Compiled to Javascript using GWT.
 (There may be a lot of redundant code right now, but it's still really fast.)

 */


if (typeof scramblers === "undefined") {
    var scramblers = {};
}

scramblers["333fm"] = scramblers["333ft"] = scramblers["333bf"] = scramblers["333oh"] = scramblers["333"] = (function () {


    function nullMethod() {
    }

    function createArray(length1, length2) {
        var result, i;
        result = Array(length1);
        for (i = 0; i < length1; result[i++] = Array(length2));
        return result;
    }

    function $clinit_CoordCube() {
        $clinit_CoordCube = nullMethod;
        UDSliceMove = createArray(495, 18);
        TwistMove = createArray(324, 18);
        FlipMove = createArray(336, 18);
        UDSliceConj = createArray(495, 8);
        UDSliceTwistPrun = Array(160380);
        UDSliceFlipPrun = Array(166320);
        TwistFlipPrun = Array(870912);
        Mid3Move = createArray(1320, 18);
        Mid32MPerm = Array(24);
        CParity = Array(346);
        CPermMove = createArray(2768, 18);
        EPermMove = createArray(2768, 10);
        MPermMove = createArray(24, 10);
        MPermConj = createArray(24, 16);
        MCPermPrun = Array(66432);
        MEPermPrun = Array(66432);
    }

    function initCParity() {
        var i;
        for (i = 0; i < 346; ++i) {
            CParity[i] = 0;
        }
        for (i = 0; i < 2768; ++i) {
            CParity[i >>> 3] = (CParity[i >>> 3] | get8Parity((CPermS2R)[i]) << (i & 7));
        }
    }

    function initCPermMove() {
        var c, d, i, j;
        c = new CubieCube_0;
        d = new CubieCube_0;
        for (i = 0; i < 2768; ++i) {
            set8Perm(c.cp, (CPermS2R)[i]);
            for (j = 0; j < 18; ++j) {
                CornMult(c, moveCube[j], d);
                CPermMove[i][j] = $getCPermSym(d);
            }
        }
    }

    function initEPermMove() {
        var c, d, i, j;
        c = new CubieCube_0;
        d = new CubieCube_0;
        for (i = 0; i < 2768; ++i) {
            set8Perm(c.ep, (EPermS2R)[i]);
            for (j = 0; j < 10; ++j) {
                EdgeMult(c, moveCube[ud2std[j]], d);
                EPermMove[i][j] = $getEPermSym(d);
            }
        }
    }

    function initFlipMove() {
        var c, d, i, j;
        c = new CubieCube_0;
        d = new CubieCube_0;
        for (i = 0; i < 336; ++i) {
            $setFlip(c, (FlipS2R)[i]);
            for (j = 0; j < 18; ++j) {
                EdgeMult(c, moveCube[j], d);
                FlipMove[i][j] = $getFlipSym(d);
            }
        }
    }

    function initMCEPermPrun(callback) {
        var SymState, c, check, corn, cornx, d, depth, done, edge, edgex, i, idx, idxx, inv, j, m_0, mid, midx, select, sym, symx;
        c = new CubieCube_0;
        d = new CubieCube_0;
        depth = 0;
        done = 1;
        SymState = Array(2768);
        for (i = 0; i < 2768; ++i) {
            SymState[i] = 0;
            set8Perm(c.ep, (EPermS2R)[i]);
            for (j = 1; j < 16; ++j) {
                EdgeMult(CubeSym[SymInv[j]], c, temp_0);
                EdgeMult(temp_0, CubeSym[j], d);
                binarySearch(EPermS2R, get8Perm(d.ep)) != 65535 && (SymState[i] = (SymState[i] | 1 << j));
            }
        }
        for (i = 0; i < 66432; ++i) {
            MEPermPrun[i] = -1;
        }
        MEPermPrun[0] = 0;
        while (done < 66432) {
            inv = depth > 7;
            select = inv ? -1 : depth;
            check = inv ? depth : -1;
            ++depth;
            for (i = 0; i < 66432; ++i) {
                if (MEPermPrun[i] === select) {
                    mid = i % 24;
                    edge = ~~(i / 24);
                    for (m_0 = 0; m_0 < 10; ++m_0) {
                        edgex = EPermMove[edge][m_0];
                        symx = edgex & 15;
                        midx = MPermConj[MPermMove[mid][m_0]][symx];
                        edgex >>>= 4;
                        idx = edgex * 24 + midx;
                        if (MEPermPrun[idx] === check) {
                            ++done;
                            if (inv) {
                                MEPermPrun[i] = depth;
                                break;
                            }
                            else {
                                MEPermPrun[idx] = depth;
                                sym = SymState[edgex];
                                if (sym != 0) {
                                    for (j = 1; j < 16; ++j) {
                                        sym = sym >> 1;
                                        if ((sym & 1) === 1) {
                                            idxx = edgex * 24 + MPermConj[midx][j];
                                            if (MEPermPrun[idxx] === -1) {
                                                MEPermPrun[idxx] = depth;
                                                ++done;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            callback("MEPermPrun: " + (Math.floor(done * 100 / 66432)) + "% (" + done + "/66432)");
        }
        for (i = 0; i < 66432; ++i) {
            MCPermPrun[i] = -1;
        }
        MCPermPrun[0] = 0;
        depth = 0;
        done = 1;
        while (done < 66432) {
            inv = depth > 7;
            select = inv ? -1 : depth;
            check = inv ? depth : -1;
            ++depth;
            for (i = 0; i < 66432; ++i) {
                if (MCPermPrun[i] === select) {
                    mid = i % 24;
                    corn = ~~(i / 24);
                    for (m_0 = 0; m_0 < 10; ++m_0) {
                        cornx = CPermMove[corn][ud2std[m_0]];
                        symx = (cornx & 15);
                        midx = MPermConj[MPermMove[mid][m_0]][symx];
                        cornx = cornx >>> 4;
                        idx = cornx * 24 + midx;
                        if (MCPermPrun[idx] === check) {
                            ++done;
                            if (inv) {
                                MCPermPrun[i] = depth;
                                break;
                            }
                            else {
                                MCPermPrun[idx] = depth;
                                sym = SymState[cornx];
                                if (sym != 0) {
                                    for (j = 1; j < 16; ++j) {
                                        sym = sym >> 1;
                                        if ((sym & 1) === 1) {
                                            idxx = cornx * 24 + MPermConj[midx][j ^ (e2c)[j]];
                                            if (MCPermPrun[idxx] === -1) {
                                                MCPermPrun[idxx] = depth;
                                                ++done;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            callback("MCPermPrun: " + (Math.floor(done * 100 / 66432)) + "% (" + done + "/66432)");
        }
    }

    function initMPermConj() {
        var c, d, i, j;
        c = new CubieCube_0;
        d = new CubieCube_0;
        for (i = 0; i < 24; ++i) {
            $setMPerm(c, i);
            for (j = 0; j < 16; ++j) {
                EdgeConjugate(c, SymInv[j], d);
                MPermConj[i][j] = $getMPerm(d);
            }
        }
    }

    function initMPermMove() {
        var c, d, i, j;
        c = new CubieCube_0;
        d = new CubieCube_0;
        for (i = 0; i < 24; ++i) {
            $setMPerm(c, i);
            for (j = 0; j < 10; ++j) {
                EdgeMult(c, moveCube[ud2std[j]], d);
                MPermMove[i][j] = $getMPerm(d);
            }
        }
    }

    function initMid32MPerm() {
        var c, i;
        c = new CubieCube_0;
        for (i = 0; i < 24; ++i) {
            $setMPerm(c, i);
            Mid32MPerm[$getMid3(c) % 24] = i;
        }
    }

    function initMid3Move() {
        var c, d, i, j;
        c = new CubieCube_0;
        d = new CubieCube_0;
        for (i = 0; i < 1320; ++i) {
            $setMid3(c, i);
            for (j = 0; j < 18; ++j) {
                EdgeMult(c, moveCube[j], d);
                Mid3Move[i][j] = $getMid3(d);
            }
        }
    }


    function initTwistFlipSlicePrun(callback) {
        var SymState, SymStateF, c, check, d, depth, done, flip, flipx, fsym, fsymx, fsymxx, i, idx, idxx, inv, j, k, m_0, select, slice, slicex, sym, symF, symx, tsymx, twist, twistx;
        SymState = Array(324);
        c = new CubieCube_0;
        d = new CubieCube_0;
        for (i = 0; i < 324; ++i) {
            SymState[i] = 0;
            $setTwist(c, TwistS2R[i]);
            for (j = 0; j < 8; ++j) {
                CornMultSym(CubeSym[SymInv[j << 1]], c, temp_0);
                CornMultSym(temp_0, CubeSym[j << 1], d);
                binarySearch(TwistS2R, $getTwist(d)) != 65535 && (SymState[i] = SymState[i] | (1 << j));
            }
        }
        SymStateF = Array(336);
        for (i = 0; i < 336; ++i) {
            SymStateF[i] = 0;
            $setFlip(c, (FlipS2R)[i]);
            for (j = 0; j < 8; ++j) {
                EdgeMult(CubeSym[SymInv[j << 1]], c, temp_0);
                EdgeMult(temp_0, CubeSym[j << 1], d);
                binarySearch(FlipS2R, $getFlip(d)) != 65535 && (SymStateF[i] = SymStateF[i] | (1 << j));
            }
        }
        for (i = 0; i < 870912; ++i) {
            TwistFlipPrun[i] = -1;
        }
        for (i = 0; i < 8; ++i) {
            TwistFlipPrun[i] = 0;
        }
        depth = 0;
        done = 8;
        while (done < 870912) {
            inv = depth > 6;
            select = inv ? -1 : depth;
            check = inv ? depth : -1;
            ++depth;
            for (i = 0; i < 870912; ++i) {
                if (TwistFlipPrun[i] != select)
                    continue;
                twist = ~~(i / 2688);
                flip = i % 2688;
                fsym = i & 7;
                flip >>>= 3;
                for (m_0 = 0; m_0 < 18; ++m_0) {
                    twistx = TwistMove[twist][m_0];
                    tsymx = twistx & 7;
                    twistx >>>= 3;
                    flipx = FlipMove[flip][Sym8Move[fsym][m_0]];
                    fsymx = Sym8MultInv[Sym8Mult[flipx & 7][fsym]][tsymx];
                    flipx >>>= 3;
                    idx = twistx * 2688 + (flipx << 3 | fsymx);
                    if (TwistFlipPrun[idx] === check) {
                        ++done;
                        if (inv) {
                            TwistFlipPrun[i] = depth;
                            break;
                        }
                        else {
                            TwistFlipPrun[idx] = depth;
                            sym = SymState[twistx];
                            symF = SymStateF[flipx];
                            if (sym != 1 || symF != 1) {
                                for (j = 0; j < 8; ++j , symF = symF >> 1) {
                                    if ((symF & 1) === 1) {
                                        fsymxx = Sym8MultInv[fsymx][j];
                                        for (k = 0; k < 8; ++k) {
                                            if ((sym & 1 << k) != 0) {
                                                idxx = twistx * 2688 + (flipx << 3 | Sym8MultInv[fsymxx][k]);
                                                if (TwistFlipPrun[idxx] === -1) {
                                                    TwistFlipPrun[idxx] = depth;
                                                    ++done;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            callback("TwistFlipPrun: " + (Math.floor(done * 100 / 870912)) + "% (" + done + "/870912)");
        }
        for (i = 0; i < 160380; ++i) {
            UDSliceTwistPrun[i] = -1;
        }
        UDSliceTwistPrun[0] = 0;
        depth = 0;
        done = 1;
        while (done < 160380) {
            inv = depth > 6;
            select = inv ? -1 : depth;
            check = inv ? depth : -1;
            ++depth;
            for (i = 0; i < 160380; ++i) {
                if (UDSliceTwistPrun[i] === select) {
                    slice = i % 495;
                    twist = ~~(i / 495);
                    for (m_0 = 0; m_0 < 18; ++m_0) {
                        twistx = TwistMove[twist][m_0];
                        symx = twistx & 7;
                        slicex = UDSliceConj[UDSliceMove[slice][m_0]][symx];
                        twistx >>>= 3;
                        idx = twistx * 495 + slicex;
                        if (UDSliceTwistPrun[idx] === check) {
                            ++done;
                            if (inv) {
                                UDSliceTwistPrun[i] = depth;
                                break;
                            }
                            else {
                                UDSliceTwistPrun[idx] = depth;
                                sym = SymState[twistx];
                                if (sym != 1) {
                                    for (j = 1; j < 8; ++j) {
                                        sym = sym >> 1;
                                        if ((sym & 1) === 1) {
                                            idxx = twistx * 495 + UDSliceConj[slicex][j];
                                            if (UDSliceTwistPrun[idxx] === -1) {
                                                UDSliceTwistPrun[idxx] = depth;
                                                ++done;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            callback("UDSliceTwistPrun: " + (Math.floor(done * 100 / 160380)) + "% (" + done + "/160380)");
        }
        for (i = 0; i < 166320; ++i) {
            UDSliceFlipPrun[i] = -1;
        }
        UDSliceFlipPrun[0] = 0;
        depth = 0;
        done = 1;
        while (done < 166320) {
            inv = depth > 6;
            select = inv ? -1 : depth;
            check = inv ? depth : -1;
            ++depth;
            for (i = 0; i < 166320; ++i) {
                if (UDSliceFlipPrun[i] === select) {
                    slice = i % 495;
                    flip = ~~(i / 495);
                    for (m_0 = 0; m_0 < 18; ++m_0) {
                        flipx = FlipMove[flip][m_0];
                        symx = flipx & 7;
                        slicex = UDSliceConj[UDSliceMove[slice][m_0]][symx];
                        flipx >>>= 3;
                        idx = flipx * 495 + slicex;
                        if (UDSliceFlipPrun[idx] === check) {
                            ++done;
                            if (inv) {
                                UDSliceFlipPrun[i] = depth;
                                break;
                            }
                            else {
                                UDSliceFlipPrun[idx] = depth;
                                sym = SymStateF[flipx];
                                if (sym != 1) {
                                    for (j = 1; j < 8; ++j) {
                                        sym = sym >> 1;
                                        if ((sym & 1) === 1) {
                                            idxx = flipx * 495 + UDSliceConj[slicex][j];
                                            if (UDSliceFlipPrun[idxx] === -1) {
                                                UDSliceFlipPrun[idxx] = depth;
                                                ++done;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            callback("UDSliceFlipPrun: " + (Math.floor(done * 100 / 166320)) + "% (" + done + "/166320)");
        }
    }

    function initTwistMove() {
        var c, d, i, j;
        c = new CubieCube_0;
        d = new CubieCube_0;
        for (i = 0; i < 324; ++i) {
            $setTwist(c, TwistS2R[i]);
            for (j = 0; j < 18; ++j) {
                CornMult(c, moveCube[j], d);
                TwistMove[i][j] = $getTwistSym(d);
            }
        }
    }

    function initUDSliceConj() {
        var c, d, i, j;
        c = new CubieCube_0;
        d = new CubieCube_0;
        for (i = 0; i < 495; ++i) {
            $setUDSlice(c, i);
            for (j = 0; j < 16; j = j + 2) {
                EdgeConjugate(c, (SymInv)[j], d);
                UDSliceConj[i][j >>> 1] = $getUDSlice(d);
            }
        }
    }

    function initUDSliceMove() {
        var c, d, i, j;
        c = new CubieCube_0;
        d = new CubieCube_0;
        for (i = 0; i < 495; ++i) {
            $setUDSlice(c, i);
            for (j = 0; j < 18; ++j) {
                EdgeMult(c, moveCube[j], d);
                UDSliceMove[i][j] = $getUDSlice(d);
            }
        }
    }

    var CParity, CPermMove, EPermMove, FlipMove, MCPermPrun, MEPermPrun, MPermConj, MPermMove, Mid32MPerm, Mid3Move, TwistFlipPrun, TwistMove, UDSliceConj, UDSliceFlipPrun, UDSliceMove, UDSliceTwistPrun;

    function $clinit_CubieCube() {
        $clinit_CubieCube = nullMethod;
        temp_0 = new CubieCube_0;
        CubeSym = Array(16);
        SymInv = Array(16);
        SymMult = createArray(16, 16);
        SymMove = createArray(16, 18);
        Sym8Mult = createArray(8, 8);
        Sym8Move = createArray(8, 18);
        Sym8MultInv = createArray(8, 8);
        SymMoveUD = createArray(16, 10);
        FlipS2R = Array(336);
        TwistS2R = Array(324);
        CPermS2R = Array(2768);
        EPermS2R = CPermS2R;
        MtoEPerm = Array(40320);
        merge = createArray(56, 56);
        e2c = [0, 0, 0, 0, 1, 3, 1, 3, 1, 3, 1, 3, 0, 0, 0, 0];
        urf1 = new CubieCube_2(2531, 1373, 67026819, 1877);
        urf2 = new CubieCube_2(2089, 1906, 322752913, 255);
        urfMove = [
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
            [6, 7, 8, 0, 1, 2, 3, 4, 5, 15, 16, 17, 9, 10, 11, 12, 13, 14],
            [3, 4, 5, 6, 7, 8, 0, 1, 2, 12, 13, 14, 15, 16, 17, 9, 10, 11],
            [2, 1, 0, 5, 4, 3, 8, 7, 6, 11, 10, 9, 14, 13, 12, 17, 16, 15],
            [8, 7, 6, 2, 1, 0, 5, 4, 3, 17, 16, 15, 11, 10, 9, 14, 13, 12],
            [5, 4, 3, 8, 7, 6, 2, 1, 0, 14, 13, 12, 17, 16, 15, 11, 10, 9]
        ];
        initMove();
        initSym();
    }

    function $$init(obj) {
        obj.cp = [0, 1, 2, 3, 4, 5, 6, 7];
        obj.co = [0, 0, 0, 0, 0, 0, 0, 0];
        obj.ep = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        obj.eo = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    function $copy(obj, c) {
        var i;
        for (i = 0; i < 8; ++i) {
            obj.cp[i] = c.cp[i];
            obj.co[i] = c.co[i];
        }
        for (i = 0; i < 12; ++i) {
            obj.ep[i] = c.ep[i];
            obj.eo[i] = c.eo[i];
        }
    }

    function $getCPermSym(obj) {
        var idx, k;
        if (EPermR2S != null) {
            idx = EPermR2S[get8Perm(obj.cp)];
            idx = (idx ^ e2c[idx & 15]);
            return idx;
        }
        for (k = 0; k < 16; ++k) {
            CornConjugate(obj, SymInv[k], obj.temps);
            idx = binarySearch(CPermS2R, get8Perm(obj.temps.cp));
            if (idx != 65535) {
                return (idx << 4 | k);
            }
        }
        return 0;
    }

    function $getDRtoDL(obj) {
        var i, idxA, idxB, mask, r, t;
        idxA = 0;
        idxB = 0;
        mask = 0;
        r = 3;
        for (i = 11; i >= 0; --i) {
            if (4 <= obj.ep[i] && obj.ep[i] <= 6) {
                idxA = idxA + (Cnk)[i][r--];
                t = 1 << obj.ep[i];
                idxB = idxB + bitCount(mask & t - 1) * fact[2 - r];
                mask = (mask | t);
            }
        }
        return idxA * 6 + idxB;
    }

    function $getEPermSym(obj) {
        var idx, k;
        if (EPermR2S != null) {
            return EPermR2S[get8Perm(obj.ep)];
        }
        for (k = 0; k < 16; ++k) {
            EdgeConjugate(obj, SymInv[k], obj.temps);
            idx = binarySearch(EPermS2R, get8Perm(obj.temps.ep));
            if (idx != 65535) {
                return (idx << 4 | k);
            }
        }
        return 0;
    }

    function $getEdgePerm(obj) {
        var i, idx, m_0, t;
        m_0 = 1 << obj.ep[11];
        idx = 0;
        for (i = 10; i >= 0; --i) {
            t = 1 << obj.ep[i];
            idx += bitCount(m_0 & t - 1) * (fact)[11 - i];
            m_0 |= t;
        }
        return idx;
    }

    function $getFlip(obj) {
        var i, idx;
        idx = 0;
        for (i = 0; i < 11; ++i) {
            idx = (idx | obj.eo[i] << i);
        }
        return idx;
    }

    function $getFlipSym(obj) {
        var idx, k;
        if (FlipR2S != null) {
            return FlipR2S[$getFlip(obj)];
        }
        for (k = 0; k < 16; k = k + 2) {
            EdgeConjugate(obj, SymInv[k], obj.temps);
            idx = binarySearch(FlipS2R, $getFlip(obj.temps));
            if (idx != 65535) {
                return (idx << 3 | k >>> 1);
            }
        }
        return 0;
    }

    function $getMPerm(obj) {
        var i, idx, m_0, t;
        m_0 = 1 << obj.ep[11];
        idx = 0;
        for (i = 10; i >= 8; --i) {
            t = 1 << obj.ep[i];
            idx += bitCount(m_0 & t - 1) * (fact)[11 - i];
            m_0 |= t;
        }
        return idx;
    }

    function $getMid3(obj) {
        var i, idxA, idxB, mask, r, t;
        idxA = 0;
        idxB = 0;
        mask = 0;
        r = 3;
        for (i = 11; i >= 0; --i) {
            if (obj.ep[i] >= 9) {
                idxA = idxA + (Cnk)[i][r--];
                t = 1 << obj.ep[i];
                idxB = idxB + bitCount(mask & t - 1) * fact[2 - r];
                mask = (mask | t);
            }
        }
        return idxA * 6 + idxB;
    }

    function $getTwist(obj) {
        var i, idx;
        idx = 0;
        for (i = 0; i < 7; ++i) {
            idx = idx * 3;
            idx = idx + obj.co[i];
        }
        return idx;
    }

    function $getTwistSym(obj) {
        var idx, k;
        if (TwistR2S != null) {
            return TwistR2S[$getTwist(obj)];
        }
        for (k = 0; k < 16; k = k + 2) {
            CornConjugate(obj, SymInv[k], obj.temps);
            idx = $getTwist(obj.temps);
            idx = binarySearch(TwistS2R, idx);
            if (idx != 65535) {
                return (idx << 3 | k >>> 1);
            }
        }
        return 0;
    }

    function $getUDSlice(obj) {
        var i, idx, r;
        idx = 0;
        r = 4;
        for (i = 0; i < 12; ++i) {
            obj.ep[i] >= 8 && (idx = idx + (Cnk)[11 - i][r--]);
        }
        return idx;
    }

    function $getURtoUL(obj) {
        var i, idxA, idxB, mask, r, t;
        idxA = 0;
        idxB = 0;
        mask = 0;
        r = 3;
        for (i = 11; i >= 0; --i) {
            if (obj.ep[i] <= 2) {
                idxA = idxA + (Cnk)[i][r--];
                t = 1 << obj.ep[i];
                idxB = idxB + bitCount(mask & t - 1) * fact[2 - r];
                mask = (mask | t);
            }
        }
        return idxA * 6 + idxB;
    }

    function $invCubieCube(obj) {
        var corn, edge, ori;
        for (edge = 0; edge < 12; ++edge)
            obj.temps.ep[obj.ep[edge]] = edge;
        for (edge = 0; edge < 12; ++edge)
            obj.temps.eo[edge] = obj.eo[obj.temps.ep[edge]];
        for (corn = 0; corn < 8; ++corn)
            obj.temps.cp[obj.cp[corn]] = corn;
        for (corn = 0; corn < 8; ++corn) {
            ori = obj.co[obj.temps.cp[corn]];
            obj.temps.co[corn] = -ori;
            obj.temps.co[corn] < 0 && (obj.temps.co[corn] = obj.temps.co[corn] + 3);
        }
        $copy(obj, obj.temps);
    }

    function $setEdgePerm(obj, idx) {
        var i, j;
        obj.ep[11] = 0;
        for (i = 10; i >= 0; --i) {
            obj.ep[i] = idx % (12 - i);
            idx = ~~(idx / (12 - i));
            for (j = i + 1; j < 12; ++j) {
                obj.ep[j] >= obj.ep[i] && ++obj.ep[j];
            }
        }
    }

    function $setFlip(obj, idx) {
        var i;
        obj.eo[11] = bitOdd(idx);
        for (i = 0; i < 11; ++i) {
            obj.eo[i] = (idx & 1);
            idx = idx >>> 1;
        }
    }

    function $setMPerm(obj, idx) {
        var i, j;
        obj.ep[11] = 8;
        for (i = 10; i >= 8; --i) {
            obj.ep[i] = idx % (12 - i) + 8;
            idx = ~~(idx / (12 - i));
            for (j = i + 1; j < 12; ++j) {
                obj.ep[j] >= obj.ep[i] && ++obj.ep[j];
            }
        }
    }

    function $setMid3(obj, idxA) {
        var edge, i, r;
        edge = (perm3)[idxA % 6];
        idxA = ~~(idxA / 6);
        r = 3;
        for (i = 11; i >= 0; --i) {
            if (idxA >= Cnk[i][r]) {
                idxA = idxA - Cnk[i][r--];
                obj.ep[i] = edge[2 - r];
            }
            else {
                obj.ep[i] = 8 - i + r;
            }
        }
    }

    function $setTwist(obj, idx) {
        var i, twst;
        twst = 0;
        for (i = 6; i >= 0; --i) {
            twst = twst + (obj.co[i] = idx % 3);
            idx = ~~(idx / 3);
        }
        obj.co[7] = (15 - twst) % 3;
    }

    function $setUDSlice(obj, idx) {
        var i, r;
        r = 4;
        for (i = 0; i < 12; ++i) {
            if (idx >= (Cnk)[11 - i][r]) {
                idx = idx - Cnk[11 - i][r--];
                obj.ep[i] = 11 - r;
            }
            else {
                obj.ep[i] = i + r - 4;
            }
        }
    }

    function $verify(obj) {
        var c, cornMask, e, edgeMask, i, sum;
        sum = 0;
        edgeMask = 0;
        for (e = 0; e < 12; ++e)
            edgeMask = (edgeMask | 1 << obj.ep[e]);
        if (edgeMask != 4095)
            return -2;
        for (i = 0; i < 12; ++i)
            sum = sum ^ obj.eo[i];
        if (sum % 2 != 0)
            return -3;
        cornMask = 0;
        for (c = 0; c < 8; ++c)
            cornMask = (cornMask | 1 << obj.cp[c]);
        if (cornMask != 255)
            return -4;
        sum = 0;
        for (i = 0; i < 8; ++i)
            sum = sum + obj.co[i];
        if (sum % 3 != 0)
            return -5;
        if ((get12Parity($getEdgePerm(obj)) ^ get8Parity(get8Perm(obj.cp))) != 0)
            return -6;
        return 0;
    }

    function CornConjugate(a, idx, b) {
        CornMultSym(CubeSym[SymInv[idx]], a, temp_0);
        CornMultSym(temp_0, CubeSym[idx], b);
    }

    function CornMult(a, b, prod) {
        var corn;
        for (corn = 0; corn < 8; ++corn) {
            prod.cp[corn] = a.cp[b.cp[corn]];
            prod.co[corn] = (a.co[b.cp[corn]] + b.co[corn]) % 3;
        }
    }

    function CornMultSym(a, b, prod) {
        var corn, ori, oriA, oriB;
        for (corn = 0; corn < 8; ++corn) {
            prod.cp[corn] = a.cp[b.cp[corn]];
            oriA = a.co[b.cp[corn]];
            oriB = b.co[corn];
            ori = oriA;
            ori = ori + (oriA < 3 ? oriB : 3 - oriB);
            ori = ori % 3;
            oriA < 3 ^ oriB < 3 && (ori = ori + 3);
            prod.co[corn] = ori;
        }
    }

    function CubieCube_0() {
        $$init(this);
    }

    function CubieCube_1(cp, co, ep, eo) {
        var i;
        $$init(this);
        for (i = 0; i < 8; ++i) {
            this.cp[i] = cp[i];
            this.co[i] = co[i];
        }
        for (i = 0; i < 12; ++i) {
            this.ep[i] = ep[i];
            this.eo[i] = eo[i];
        }
    }

    function CubieCube_2(cperm, twist, eperm, flip) {
        $$init(this);
        set8Perm(this.cp, cperm);
        $setTwist(this, twist);
        $setEdgePerm(this, eperm);
        $setFlip(this, flip);
    }

    function CubieCube_3(c) {
        CubieCube_1.call(this, c.cp, c.co, c.ep, c.eo);
    }

    function EdgeConjugate(a, idx, b) {
        EdgeMult(CubeSym[SymInv[idx]], a, temp_0);
        EdgeMult(temp_0, CubeSym[idx], b);
    }

    function EdgeMult(a, b, prod) {
        var ed;
        for (ed = 0; ed < 12; ++ed) {
            prod.ep[ed] = a.ep[b.ep[ed]];
            prod.eo[ed] = (b.eo[ed] ^ a.eo[b.ep[ed]]);
        }
    }

    function get8Perm(arr) {
        var i, idx, v, val;
        idx = 0;
        val = 1985229328;
        for (i = 0; i < 7; ++i) {
            v = arr[i] << 2;
            idx = (8 - i) * idx + (val >> v & 7);
            val -= 286331152 << v;
        }
        return idx;
    }

    function initMove() {
        var m_0, mc, p;
        mc = Array(18);
        moveCube = [new CubieCube_2(15120, 0, 119750400, 0), new CubieCube_2(21021, 1494, 323403417, 0), new CubieCube_2(8064, 1236, 29441808, 802), new CubieCube_2(9, 0, 5880, 0), new CubieCube_2(1230, 412, 2949660, 0), new CubieCube_2(224, 137, 328552, 1160)];
        for (m_0 = 0; m_0 < 6; ++m_0) {
            mc[m_0 * 3] = moveCube[m_0];
            for (p = 0; p < 2; ++p) {
                mc[m_0 * 3 + p + 1] = new CubieCube_0;
                EdgeMult(mc[m_0 * 3 + p], moveCube[m_0], mc[m_0 * 3 + p + 1]);
                CornMult(mc[m_0 * 3 + p], moveCube[m_0], mc[m_0 * 3 + p + 1]);
            }
        }
        moveCube = mc;
    }

    function initSym() {
        var c, d, f2, i, j, k, lr2, m_0, s, temp, u4;
        c = new CubieCube_0;
        d = new CubieCube_0;
        f2 = new CubieCube_2(28783, 0, 259268407, 0);
        u4 = new CubieCube_2(15138, 0, 119765538, 1792);
        lr2 = new CubieCube_2(5167, 0, 83473207, 0);
        lr2.co = [3, 3, 3, 3, 3, 3, 3, 3];
        for (i = 0; i < 16; ++i) {
            CubeSym[i] = new CubieCube_3(c);
            CornMultSym(c, u4, d);
            EdgeMult(c, u4, d);
            temp = d;
            d = c;
            c = temp;
            if (i % 4 === 3) {
                CornMultSym(temp, lr2, d);
                EdgeMult(temp, lr2, d);
                temp = d;
                d = c;
                c = temp;
            }
            if (i % 8 === 7) {
                CornMultSym(temp, f2, d);
                EdgeMult(temp, f2, d);
                temp = d;
                d = c;
                c = temp;
            }
        }
        for (j = 0; j < 16; ++j) {
            for (k = 0; k < 16; ++k) {
                CornMultSym(CubeSym[j], CubeSym[k], c);
                if (c.cp[0] === 0 && c.cp[1] === 1 && c.cp[2] === 2) {
                    SymInv[j] = k;
                    break;
                }
            }
        }
        for (i = 0; i < 16; ++i) {
            for (j = 0; j < 16; ++j) {
                CornMultSym(CubeSym[i], CubeSym[j], c);
                for (k = 0; k < 16; ++k) {
                    if (CubeSym[k].cp[0] === c.cp[0] && CubeSym[k].cp[1] === c.cp[1] && CubeSym[k].cp[2] === c.cp[2]) {
                        SymMult[i][j] = k;
                        break;
                    }
                }
            }
        }
        for (j = 0; j < 18; ++j) {
            for (s = 0; s < 16; ++s) {
                CornConjugate(moveCube[j], SymInv[s], c);
                CONTINUE: for (m_0 = 0; m_0 < 18; ++m_0) {
                    for (i = 0; i < 8; ++i) {
                        if (c.cp[i] != moveCube[m_0].cp[i] || c.co[i] != moveCube[m_0].co[i]) {
                            continue CONTINUE;
                        }
                    }
                    SymMove[s][j] = m_0;
                }
            }
        }
        for (j = 0; j < 10; ++j) {
            for (s = 0; s < 16; ++s) {
                SymMoveUD[s][j] = (std2ud)[SymMove[s][ud2std[j]]];
            }
        }
        for (j = 0; j < 8; ++j) {
            for (s = 0; s < 8; ++s) {
                Sym8Mult[s][j] = SymMult[s << 1][j << 1] >>> 1;
            }
        }
        for (j = 0; j < 18; ++j) {
            for (s = 0; s < 8; ++s) {
                Sym8Move[s][j] = SymMove[s << 1][j];
            }
        }
        for (j = 0; j < 8; ++j) {
            for (s = 0; s < 8; ++s) {
                Sym8MultInv[j][s] = Sym8Mult[j][SymInv[s << 1] >> 1];
            }
        }
    }

    function initSym2Raw() {
        var a, b, c, count, d, i, idx, j, m_0, mask, occ, s;
        c = new CubieCube_0;
        d = new CubieCube_0;
        occ = Array(1260);
        count = 0;
        for (i = 0; i < 64; occ[i++] = 0)
            ;
        for (i = 0; i < 2048; ++i) {
            if ((occ[i >>> 5] & 1 << (i & 31)) === 0) {
                $setFlip(c, i);
                for (s = 0; s < 16; s = s + 2) {
                    EdgeMult(CubeSym[SymInv[s]], c, temp_0);
                    EdgeMult(temp_0, CubeSym[s], d);
                    idx = $getFlip(d);
                    occ[idx >>> 5] |= 1 << (idx & 31);
                    FlipR2S[idx] = (count << 3 | s >>> 1);
                }
                FlipS2R[count++] = i;
            }
        }
        count = 0;
        for (i = 0; i < 69; occ[i++] = 0)
            ;
        for (i = 0; i < 2187; ++i) {
            if ((occ[i >>> 5] & 1 << (i & 31)) === 0) {
                $setTwist(c, i);
                for (s = 0; s < 16; s = s + 2) {
                    CornMultSym(CubeSym[SymInv[s]], c, temp_0);
                    CornMultSym(temp_0, CubeSym[s], d);
                    idx = $getTwist(d);
                    occ[idx >>> 5] |= 1 << (idx & 31);
                    TwistR2S[idx] = (count << 3 | s >>> 1);
                }
                TwistS2R[count++] = i;
            }
        }

        mask = Array(2);
        mask[0] = Array(56);
        mask[1] = Array(56);
        for (i = 0; i < 56; ++i) {
            mask[0][i] = mask[1][i] = 0;
        }
        for (i = 0; i < 40320; ++i) {
            set8Perm(c.ep, i);
            a = ~~($getURtoUL(c) / 6);
            b = ~~($getDRtoDL(c) / 6);
            mask[b >> 5][a] |= 1 << (b & 0x1f);
        }
        for (i = 0; i < 56; ++i) {
            count = 0;
            for (j = 0; j < 56; ++j) {
                ((mask[j >> 5][i] & (1 << (j & 0x1f))) != 0) && (merge[i][j] = count++);
            }
        }
        count = 0;
        for (i = 0; i < 1260; occ[i++] = 0)
            ;
        for (i = 0; i < 40320; ++i) {
            if ((occ[i >>> 5] & 1 << (i & 31)) === 0) {
                set8Perm(c.ep, i);
                for (s = 0; s < 16; ++s) {
                    EdgeMult(CubeSym[SymInv[s]], c, temp_0);
                    EdgeMult(temp_0, CubeSym[s], d);
                    idx = get8Perm(d.ep);
                    occ[idx >>> 5] |= 1 << (idx & 31);
                    a = $getURtoUL(d);
                    b = $getDRtoDL(d);
                    m_0 = merge[~~(a / 6)][~~(b / 6)] * 4032 + a * 12 + b % 6 * 2 + get8Parity(idx);
                    MtoEPerm[m_0] = (count << 4 | s);
                    EPermR2S[idx] = (count << 4 | s);
                }
                EPermS2R[count++] = i;
            }
        }
    }

    function set8Perm(arr, idx) {
        var i, m_0, p, v, val;
        val = 1985229328;
        for (i = 0; i < 7; ++i) {
            p = (fact)[7 - i];
            v = ~~(idx / p);
            idx = idx - v * p;
            v <<= 2;
            arr[i] = (val >> v & 7);
            m_0 = (1 << v) - 1;
            val = (val & m_0) + (val >> 4 & ~m_0);
        }
        arr[7] = val;
    }

    function CubieCube() {
    }

    _ = CubieCube_3.prototype = CubieCube_2.prototype = CubieCube_0.prototype = CubieCube.prototype;
    _.temps = null;
    var CPermS2R, CubeSym, EPermR2S = null, EPermS2R, FlipR2S = null, FlipS2R, MtoEPerm, Sym8Move, Sym8Mult, Sym8MultInv, SymInv, SymMove, SymMoveUD, SymMult, TwistR2S = null, TwistS2R, e2c, merge, moveCube = null, temp_0, urf1, urf2, urfMove;


    function $Solve(obj, c) {
        var i;
        c.temps = new CubieCube_0;
        for (i = 0; i < 6; ++i) {
            obj.twist[i] = $getTwistSym(c);
            obj.tsym[i] = obj.twist[i] & 7;
            obj.twist[i] >>>= 3;
            obj.flip[i] = $getFlipSym(c);
            obj.fsym[i] = obj.flip[i] & 7;
            obj.flip[i] >>>= 3;
            obj.slice_0[i] = $getUDSlice(c);
            obj.corn0[i] = $getCPermSym(c);
            obj.csym0[i] = obj.corn0[i] & 15;
            obj.corn0[i] >>>= 4;
            obj.mid30[i] = $getMid3(c);
            obj.e10[i] = $getURtoUL(c);
            obj.e20[i] = $getDRtoDL(c);
            obj.prun[i] = Math.max(Math.max((UDSliceTwistPrun)[obj.twist[i] * 495 + UDSliceConj[obj.slice_0[i]][obj.tsym[i]]], UDSliceFlipPrun[obj.flip[i] * 495 + UDSliceConj[obj.slice_0[i]][obj.fsym[i]]]), TwistFlipPrun[obj.twist[i] * 2688 + (obj.flip[i] << 3 | (Sym8MultInv)[obj.fsym[i]][obj.tsym[i]])]);
            CornMult(urf2, c, c.temps);
            CornMult(c.temps, urf1, c);
            EdgeMult(urf2, c, c.temps);
            EdgeMult(c.temps, urf1, c);
            i === 2 && $invCubieCube(c);
        }
        obj.solution = null;
        for (obj.length1 = 0; obj.length1 < obj.sol; ++obj.length1) {
            obj.maxlength2 = Math.min(~~(obj.sol / 2) + 1, obj.sol - obj.length1);
            for (obj.urfidx = 0; obj.urfidx < 6; ++obj.urfidx) {
                obj.corn[0] = obj.corn0[obj.urfidx];
                obj.csym[0] = obj.csym0[obj.urfidx];
                obj.mid3[0] = obj.mid30[obj.urfidx];
                obj.e1[0] = obj.e10[obj.urfidx];
                obj.e2[0] = obj.e20[obj.urfidx];
                if (obj.prun[obj.urfidx] <= obj.length1 && $phase1(obj, obj.twist[obj.urfidx], obj.tsym[obj.urfidx], obj.flip[obj.urfidx], obj.fsym[obj.urfidx], obj.slice_0[obj.urfidx], obj.length1, 18)) {
                    return obj.solution === null ? 'Error 8' : obj.solution;
                }
            }
        }
        return 'Error 7';
    }

    function $init2(obj) {
        var cornx, edge, esym, ex, i, lm, m_0, mid, prun, s, sb, urf;
        obj.valid2 = Math.min(obj.valid2, obj.valid1);
        for (i = obj.valid1; i < obj.length1; ++i) {
            m_0 = obj.move[i];
            obj.corn[i + 1] = (CPermMove)[obj.corn[i]][(SymMove)[obj.csym[i]][m_0]];
            obj.csym[i + 1] = SymMult[obj.corn[i + 1] & 15][obj.csym[i]];
            obj.corn[i + 1] >>>= 4;
            obj.mid3[i + 1] = Mid3Move[obj.mid3[i]][m_0];
        }
        obj.valid1 = obj.length1;
        mid = (Mid32MPerm)[obj.mid3[obj.length1] % 24];
        prun = MCPermPrun[obj.corn[obj.length1] * 24 + MPermConj[mid][obj.csym[obj.length1]]];
        if (prun >= obj.maxlength2) {
            return false;
        }
        for (i = obj.valid2; i < obj.length1; ++i) {
            obj.e1[i + 1] = Mid3Move[obj.e1[i]][obj.move[i]];
            obj.e2[i + 1] = Mid3Move[obj.e2[i]][obj.move[i]];
        }
        obj.valid2 = obj.length1;
        cornx = obj.corn[obj.length1];
        ex = (merge)[~~(obj.e1[obj.length1] / 6)][~~(obj.e2[obj.length1] / 6)] * 4032 + obj.e1[obj.length1] * 12 + obj.e2[obj.length1] % 6 * 2 + (CParity[cornx >>> 3] >>> (cornx & 7) & 1 ^ (parity4)[mid]);
        edge = MtoEPerm[ex];
        esym = edge & 15;
        edge >>>= 4;
        prun = Math.max(MEPermPrun[edge * 24 + MPermConj[mid][esym]], prun);
        if (prun >= obj.maxlength2) {
            return false;
        }
        lm = obj.length1 === 0 ? 10 : std2ud[~~(obj.move[obj.length1 - 1] / 3) * 3 + 1];
        for (i = prun; i < obj.maxlength2; ++i) {
            if ($phase2(obj, edge, esym, obj.corn[obj.length1], obj.csym[obj.length1], mid, i, obj.length1, lm)) {
                obj.sol = obj.length1 + i;
                sb = "";
                urf = obj.urfidx;
                (urf = (urf + 3) % 6);
                if (urf < 3) {
                    for (s = 0; s < obj.length1; ++s) {
                        sb += move2str[urfMove[urf][obj.move[s]]];
                        sb += ' ';
                    }
                    obj.useSeparator && (sb.impl.string += '.' , sb);
                    for (s = obj.length1; s < obj.sol; ++s) {
                        sb += move2str[urfMove[urf][obj.move[s]]];
                        sb += ' ';
                    }
                }
                else {
                    for (s = obj.sol - 1; s >= obj.length1; --s) {
                        sb += move2str[urfMove[urf][obj.move[s]]];
                        sb += ' ';
                    }
                    obj.useSeparator && (sb += '.' , sb);
                    for (s = obj.length1 - 1; s >= 0; --s) {
                        sb += move2str[urfMove[urf][obj.move[s]]];
                        sb += ' ';
                    }
                }
                obj.solution = sb;
                return true;
            }
        }
        return false;
    }

    function $phase1(obj, twist, tsym, flip, fsym, slice, maxl, lm) {
        var flipx, fsymx, m_0, slicex, tsymx, twistx;
        if (twist === 0 && flip === 0 && slice === 0 && maxl < 5) {
            return maxl === 0 && $init2(obj);
        }
        for (m_0 = 0; m_0 < 18; ++m_0) {
            if ((ckmv)[lm][m_0]) {
                m_0 += 2;
                continue;
            }
            slicex = (UDSliceMove)[slice][m_0];
            twistx = TwistMove[twist][Sym8Move[tsym][m_0]];
            tsymx = Sym8Mult[twistx & 7][tsym];
            twistx >>>= 3;
            if (UDSliceTwistPrun[twistx * 495 + UDSliceConj[slicex][tsymx]] >= maxl) {
                continue;
            }
            flipx = FlipMove[flip][Sym8Move[fsym][m_0]];
            fsymx = Sym8Mult[flipx & 7][fsym];
            flipx >>>= 3;
            if (TwistFlipPrun[twistx * 2688 + (flipx << 3 | Sym8MultInv[fsymx][tsymx])] >= maxl || UDSliceFlipPrun[flipx * 495 + UDSliceConj[slicex][fsymx]] >= maxl) {
                continue;
            }
            obj.move[obj.length1 - maxl] = m_0;
            obj.valid1 = Math.min(obj.valid1, obj.length1 - maxl);
            if ($phase1(obj, twistx, tsymx, flipx, fsymx, slicex, maxl - 1, m_0)) {
                return true;
            }
        }
        return false;
    }

    function $phase2(obj, edge, esym, corn, csym, mid, maxl, depth, lm) {
        var cornx, csymx, edgex, esymx, m_0, midx;
        if (edge === 0 && corn === 0 && mid === 0) {
            return true;
        }
        for (m_0 = 0; m_0 < 10; ++m_0) {
            if ((ckmv2)[lm][m_0]) {
                continue;
            }
            midx = (MPermMove)[mid][m_0];
            edgex = EPermMove[edge][(SymMoveUD)[esym][m_0]];
            esymx = SymMult[edgex & 15][esym];
            edgex >>>= 4;
            if (MEPermPrun[edgex * 24 + MPermConj[midx][esymx]] >= maxl) {
                continue;
            }
            cornx = CPermMove[corn][SymMove[csym][ud2std[m_0]]];
            csymx = SymMult[cornx & 15][csym];
            cornx >>>= 4;
            if (MCPermPrun[cornx * 24 + MPermConj[midx][csymx]] >= maxl) {
                continue;
            }
            obj.move[depth] = ud2std[m_0];
            if ($phase2(obj, edgex, esymx, cornx, csymx, midx, maxl - 1, depth + 1, m_0)) {
                return true;
            }
        }
        return false;
    }

    function $solution(obj, facelets) {
        var $e0, cc, i, s;
        init_0();
        for (i = 0; i < 54; ++i) {
            switch (facelets.charCodeAt(i)) {
                case 85:
                    obj.f[i] = 0;
                    break;
                case 82:
                    obj.f[i] = 1;
                    break;
                case 70:
                    obj.f[i] = 2;
                    break;
                case 68:
                    obj.f[i] = 3;
                    break;
                case 76:
                    obj.f[i] = 4;
                    break;
                case 66:
                    obj.f[i] = 5;
                    break;
                default:
                    return 'Error 1';
            }
        }
        cc = toCubieCube(obj.f);
        obj.sol = 22;
        return $Solve(obj, cc);
    }

    function Search() {
        this.move = Array(31);
        this.corn = Array(20);
        this.csym = Array(20);
        this.mid3 = Array(20);
        this.e1 = Array(20);
        this.e2 = Array(20);
        this.twist = Array(6);
        this.tsym = Array(6);
        this.flip = Array(6);
        this.fsym = Array(6);
        this.slice_0 = Array(6);
        this.corn0 = Array(6);
        this.csym0 = Array(6);
        this.mid30 = Array(6);
        this.e10 = Array(6);
        this.e20 = Array(6);
        this.prun = Array(6);
        this.count = Array(6);
        this.f = Array(54);
    }

    _ = Search.prototype;
    _.inverse = false;
    _.length1 = 0;
    _.maxlength2 = 0;
    _.sol = 999;
    _.solution = null;
    _.urfidx = 0;
    _.useSeparator = false;
    _.valid1 = 0;
    _.valid2 = 0;

    function init_0(safeStatusCallback) {
        if (inited)
            return;
        $clinit_Util();
        safeStatusCallback("[0/9] Initializing Cubie Cube...");
        $clinit_CubieCube();
        FlipR2S = Array(2048);
        TwistR2S = Array(2187);
        EPermR2S = Array(40320);
        safeStatusCallback("[1/9] Initializing Sym2Raw...");
        initSym2Raw();
        safeStatusCallback("[2/9] Initializing CoordCube...");
        $clinit_CoordCube();
        safeStatusCallback("[3/9] Initializing Perm, Flip, and Twist Moves...");
        initCPermMove();
        initEPermMove();
        initFlipMove();
        initTwistMove();
        safeStatusCallback("[4/9] Initializing UDSlice...");
        EPermR2S = null;
        FlipR2S = null;
        TwistR2S = null;
        initUDSliceMove();
        initUDSliceConj();
        safeStatusCallback("[5/9] Initializing Mid3Move...");
        initMid3Move();
        initMid32MPerm();
        initCParity();
        safeStatusCallback("[6/9] Initializing Perms...");
        initMPermMove();
        initMPermConj();
        safeStatusCallback("[7/9] Initializing TwistFlipSlicePrun...");
        initTwistFlipSlicePrun(safeStatusCallback);
        safeStatusCallback("[8/9] Initializing MCEPermPrum...");
        initMCEPermPrun(safeStatusCallback);
        safeStatusCallback("[9/9] Done initializing 3x3x3...");
        inited = true;
    }

    var inited = false;

    function $clinit_Util() {
        $clinit_Util = nullMethod;
        var i, j;
        cornerFacelet = [
            [8, 9, 20],
            [6, 18, 38],
            [0, 36, 47],
            [2, 45, 11],
            [29, 26, 15],
            [27, 44, 24],
            [33, 53, 42],
            [35, 17, 51]
        ];
        edgeFacelet = [
            [5, 10],
            [7, 19],
            [3, 37],
            [1, 46],
            [32, 16],
            [28, 25],
            [30, 43],
            [34, 52],
            [23, 12],
            [21, 41],
            [50, 39],
            [48, 14]
        ];
        cornerColor = [
            [0, 1, 2],
            [0, 2, 4],
            [0, 4, 5],
            [0, 5, 1],
            [3, 2, 1],
            [3, 4, 2],
            [3, 5, 4],
            [3, 1, 5]
        ];
        edgeColor = [
            [0, 1],
            [0, 2],
            [0, 4],
            [0, 5],
            [3, 1],
            [3, 2],
            [3, 4],
            [3, 5],
            [2, 1],
            [2, 4],
            [5, 4],
            [5, 1]
        ];
        Cnk = createArray(12, 12);
        fact = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600];
        move2str = ['U ', 'U2', "U'", 'R ', 'R2', "R'", 'F ', 'F2', "F'", 'D ', 'D2', "D'", 'L ', 'L2', "L'", 'B ', 'B2', "B'"];
        ud2std = [0, 1, 2, 4, 7, 9, 10, 11, 13, 16];
        std2ud = Array(18);
        ckmv = createArray(19, 18);
        ckmv2 = createArray(11, 10);
        parity4 = Array(24);
        perm3 = [
            [11, 10, 9],
            [10, 11, 9],
            [11, 9, 10],
            [9, 11, 10],
            [10, 9, 11],
            [9, 10, 11]
        ];
        for (i = 0; i < 10; ++i) {
            std2ud[ud2std[i]] = i;
        }
        for (i = 0; i < 18; ++i) {
            for (j = 0; j < 18; ++j) {
                ckmv[i][j] = ~~(i / 3) === ~~(j / 3) || ~~(i / 3) % 3 === ~~(j / 3) % 3 && i >= j;
            }
            ckmv[18][i] = false;
        }
        for (i = 0; i < 10; ++i) {
            for (j = 0; j < 10; ++j) {
                ckmv2[i][j] = ckmv[ud2std[i]][ud2std[j]];
            }
            ckmv2[10][i] = false;
        }
        for (i = 0; i < 12; ++i)
            for (j = 0; j < 12; ++j)
                Cnk[i][j] = 0;
        for (i = 0; i < 12; ++i) {
            Cnk[i][0] = 1;
            Cnk[i][i] = 1;
            for (j = 1; j < i; ++j) {
                Cnk[i][j] = Cnk[i - 1][j - 1] + Cnk[i - 1][j];
            }
        }
        for (i = 0; i < 24; ++i) {
            parity4[i] = get4Parity(i);
        }
    }

    function binarySearch(arr, key) {
        var l_0, length_0, mid, r, val;
        length_0 = arr.length;
        if (key <= arr[length_0 - 1]) {
            l_0 = 0;
            r = length_0 - 1;
            while (l_0 <= r) {
                mid = l_0 + r >>> 1;
                val = arr[mid];
                if (key > val) {
                    l_0 = mid + 1;
                }
                else if (key < val) {
                    r = mid - 1;
                }
                else {
                    return mid;
                }
            }
        }
        return 65535;
    }

    function bitCount(i) {
        i = i - (i >>> 1 & 1431655765);
        i = (i & 858993459) + (i >>> 2 & 858993459);
        return i + (i >>> 8) + (i >>> 4) & 15;
    }

    function bitOdd(i) {
        i = (i ^ i >>> 1);
        i = (i ^ i >>> 2);
        i = (i ^ i >>> 4);
        i = (i ^ i >>> 8);
        return (i & 1);
    }

    function get12Parity(idx) {
        var i, p;
        p = 0;
        for (i = 10; i >= 0; --i) {
            p = p + idx % (12 - i);
            idx = ~~(idx / (12 - i));
        }
        p = (p & 1);
        return p;
    }

    function get4Parity(idx) {
        var i, p;
        p = 0;
        for (i = 2; i >= 0; --i) {
            p = p + idx % (4 - i);
            idx = ~~(idx / (4 - i));
        }
        p = (p & 1);
        return p;
    }

    function get8Parity(idx) {
        var i, p;
        p = 0;
        for (i = 6; i >= 0; --i) {
            p = p + idx % (8 - i);
            idx = ~~(idx / (8 - i));
        }
        p = (p & 1);
        return p;
    }

    function toCubieCube(f) {
        var ccRet, col1, col2, i, j, ori;
        ccRet = new CubieCube_0;
        for (i = 0; i < 8; ++i)
            ccRet.cp[i] = 0;
        for (i = 0; i < 12; ++i)
            ccRet.ep[i] = 0;
        for (i = 0; i < 8; ++i) {
            for (ori = 0; ori < 3; ++ori)
                if (f[cornerFacelet[i][ori]] === 0 || f[cornerFacelet[i][ori]] === 3)
                    break;
            col1 = f[cornerFacelet[i][(ori + 1) % 3]];
            col2 = f[cornerFacelet[i][(ori + 2) % 3]];
            for (j = 0; j < 8; ++j) {
                if (col1 === cornerColor[j][1] && col2 === cornerColor[j][2]) {
                    ccRet.cp[i] = j;
                    ccRet.co[i] = ori % 3;
                    break;
                }
            }
        }
        for (i = 0; i < 12; ++i) {
            for (j = 0; j < 12; ++j) {
                if (f[edgeFacelet[i][0]] === edgeColor[j][0] && f[edgeFacelet[i][1]] === edgeColor[j][1]) {
                    ccRet.ep[i] = j;
                    ccRet.eo[i] = 0;
                    break;
                }
                if (f[edgeFacelet[i][0]] === edgeColor[j][1] && f[edgeFacelet[i][1]] === edgeColor[j][0]) {
                    ccRet.ep[i] = j;
                    ccRet.eo[i] = 1;
                    break;
                }
            }
        }
        return ccRet;
    }

    function toFaceCube(cc) {
        var c, e, f, i, j, n, ori, ts;
        f = Array(54);
        ts = [85, 82, 70, 68, 76, 66];
        for (i = 0; i < 54; ++i) {
            f[i] = ts[~~(i / 9)];
        }
        for (c = 0; c < 8; ++c) {
            j = cc.cp[c];
            ori = cc.co[c];
            for (n = 0; n < 3; ++n)
                f[cornerFacelet[c][(n + ori) % 3]] = ts[cornerColor[j][n]];
        }
        for (e = 0; e < 12; ++e) {
            j = cc.ep[e];
            ori = cc.eo[e];
            for (n = 0; n < 2; ++n)
                f[edgeFacelet[e][(n + ori) % 2]] = ts[edgeColor[j][n]];
        }
        return String.fromCharCode.apply(null, f);
    }

    var Cnk, ckmv, ckmv2, cornerColor, cornerFacelet, edgeColor, edgeFacelet, fact, move2str, parity4, perm3, std2ud, ud2std;


    /* Methods added by Lucas. */


    var randomSource = undefined;

    // If we have a better (P)RNG:
    var setRandomSource = function (src) {
        randomSource = src;
    }

    //"UF UR UB UL DF DR DB DL FR FL BR BL UFR URB UBL ULF DRF DFL DLB DBR URFLBD";
    //0  3  6  9  12 15 18 21 24 27 30 33 36  40  44  48  52  56  60  64  68

    var drawingStickerMap = [
        [   // U
            [ 0, 1, 2],
            [ 3, 4, 5],
            [ 6, 7, 8]
        ],
        [ // R
            [ 9, 10, 11],
            [12, 13, 14],
            [15, 16, 17]
        ],
        [ // F
            [18, 19, 20],
            [21, 22, 23],
            [24, 25, 26]
        ],
        [ // L
            [36, 37, 38],
            [39, 40, 41],
            [42, 43, 44]
        ],
        [ // B
            [45, 46, 47],
            [48, 49, 50],
            [51, 52, 53]
        ],
        [ // D
            [27, 28, 29],
            [30, 31, 32],
            [33, 34, 35]
        ]
    ];

    var border = 2;
    var width = 12;
    //URFLBD
    var drawingCenters = [
        [border + width / 2 * 9 , border + width / 2 * 3 ],
        [border + width / 2 * 15, border + width / 2 * 9 ],
        [border + width / 2 * 9 , border + width / 2 * 9 ],
        [border + width / 2 * 3 , border + width / 2 * 9 ],
        [border + width / 2 * 21, border + width / 2 * 9 ],
        [border + width / 2 * 9 , border + width / 2 * 15],
    ];


    function colorGet(col) {
        if (col === "r") return ("#FF0000");
        if (col === "o") return ("#FF8000");
        if (col === "b") return ("#0000FF");
        if (col === "g") return ("#00FF00");
        if (col === "y") return ("#FFFF00");
        if (col === "w") return ("#FFFFFF");
        if (col === "x") return ("#000000");
    }

    function drawSquare(r, cx, cy, w, fillColor) {

        var arrx = [cx - w, cx - w, cx + w, cx + w];
        var arry = [cy - w, cy + w, cy + w, cy - w];

        var pathString = "";
        for (var i = 0; i < arrx.length; i++) {
            pathString += ((i === 0) ? "M" : "L") + arrx[i] + "," + arry[i];
        }
        pathString += "z";

        r.path(pathString).attr({fill: colorGet(fillColor), stroke: "#000"})
    }

    var drawScramble = function (parentElement, state) {

        var colorString = "wrgoby"; // UFRLBD
        var colorScheme = {
            "U": colorString[0],
            "R": colorString[1],
            "F": colorString[2],
            "L": colorString[3],
            "B": colorString[4],
            "D": colorString[5]
        };

        var r = Raphael(parentElement, border * 2 + width * 12, border * 2 + width * 9);
        parentElement.width = border * 2 + width * 12;

        var stateWithCenters = state + " URFLBD";

        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 3; j++) {
                for (var k = 0; k < 3; k++) {
                    var face = stateWithCenters[drawingStickerMap[i][j][k]];
                    drawSquare(r, drawingCenters[i][0] + (k - 1) * width, drawingCenters[i][1] + (j - 1) * width, width / 2, colorScheme[face]);
                }
            }
        }

    };

    var initialized = false;

    var ini = function (callback, iniRandomSource, statusCallback) {

        if (typeof statusCallback !== "function") {
            statusCallback = function () {
            };
        }

        if (!initialized) {
            search = new Search;
            init_0(statusCallback);
            setRandomSource(iniRandomSource);
            initialized = true;
        }
        if (callback) setTimeout(callback, 0);
    };


// SCRAMBLERS

    var rn = function (n) {
        return Math.floor(randomSource.random() * n);
    }

    var getRandomScramble = function () {
        var cperm, eperm;
        do {
            eperm = rn(479001600);
            cperm = rn(40320);
        } while ((get8Parity(cperm) ^ get12Parity(eperm)) != 0);
        var posit = toFaceCube(new CubieCube_2(cperm, rn(2187), eperm, rn(2048)));
        return $solution(search, posit);
    }

    var getEdgeScramble = function () {
        var eperm;
        do {
            eperm = rn(479001600);
        } while ((get8Parity(0) ^ get12Parity(eperm)) != 0);
        var posit = toFaceCube(new CubieCube_2(0, 0, eperm, rn(2048)));
        return $solution(search, posit);
    }

    var getCornerScramble = function () {
        var cperm;
        do {
            cperm = rn(40320);
        } while ((get8Parity(cperm) ^ get12Parity(0)) != 0);
        var posit = toFaceCube(new CubieCube_2(cperm, rn(2187), 0, 0));
        return $solution(search, posit);
    }

    var getLLScramble = function () {
        var cperm, eperm, cori, csum, eori, esum;
        do {
            eperm = 362880 * (rn(2) + 10 * (rn(3) + 11 * rn(4)));
            cperm = 120 * (rn(2) + 6 * (rn(3) + 7 * rn(4)));
        } while ((get8Parity(cperm) ^ get12Parity(eperm)) != 0);
        var cpow = [729, 243, 81, 27];
        do {
            csum = 0;
            cori = 0;
            for (var i = 0; i < 4; i++) {
                var j = rn(3);
                csum += j;
                cori += j * cpow[i];
            }
        } while (csum % 3 != 0);
        var epow = [8, 4, 2, 1];
        do {
            esum = 0;
            eori = 0;
            for (var i = 0; i < 4; i++) {
                var j = rn(2);
                esum += j;
                eori += j * epow[i];
            }
        } while (esum % 2 != 0);
        var posit = toFaceCube(new CubieCube_2(cperm, cori, eperm, eori));
        return $solution(search, posit);
    }

    var getLSLLScramble = function () {
        var cperm, eperm, cori, csum, eori, esum;
        do {
            var edest = rn(5);
            //0 + 2*(0 + 3*(0 + 4*(1 + 5*(1 + 6*(1 + 7*(1 + 8*(rn(2) + 9*(6 + 10*(rn(3) + 11*rn(4))))))))));
            switch (edest) {
                case 0:
                    eperm = 362880 * (rn(2) + 10 * (rn(3) + 11 * rn(4)));
                    break;
                case 1:
                    eperm = 5904 + 40320 * (5 + 9 * (rn(2) + 10 * (rn(3) + 11 * rn(4))));
                    break;
                case 2:
                    eperm = 5904 + 40320 * (rn(2) + 9 * (6 + 10 * (rn(3) + 11 * rn(4))));
                    break;
                case 3:
                    eperm = 5904 + 40320 * (rn(2) + 9 * (rn(3) + 10 * (7 + 11 * rn(4))));
                    break;
                default:
                    eperm = 5904 + 40320 * (rn(2) + 9 * (rn(3) + 10 * (rn(4) + 11 * 8)));
                    break;
            }
            var cdest = rn(5);
            switch (cdest) {
                case 0:
                    cperm = 120 * (rn(2) + 6 * (rn(3) + 7 * rn(4)));
                    break;
                case 1:
                    cperm = 24 * (1 + 5 * (rn(2) + 6 * (rn(3) + 7 * rn(4))));
                    break;
                case 2:
                    cperm = 24 * (rn(2) + 5 * (2 + 6 * (rn(3) + 7 * rn(4))));
                    break;
                case 3:
                    cperm = 24 * (rn(2) + 5 * (rn(3) + 6 * (3 + 7 * rn(4))));
                    break;
                default:
                    cperm = 24 * (rn(2) + 5 * (rn(3) + 6 * (rn(4) + 7 * 4)));
                    break;
            }
        } while ((get8Parity(cperm) ^ get12Parity(eperm)) != 0);
        var cpow = [729, 243, 81, 27, 9];
        do {
            csum = 0;
            cori = 0;
            for (var i = 0; i < 5; i++) {
                var j = rn(3);
                csum += j;
                cori += j * cpow[i];
            }
        } while (csum % 3 != 0);
        var epow = [256, 8, 4, 2, 1];
        do {
            esum = 0;
            eori = 0;
            for (var i = 0; i < 5; i++) {
                var j = rn(2);
                esum += j;
                eori += j * epow[i];
            }
        } while (esum % 2 != 0);
        var posit = toFaceCube(new CubieCube_2(cperm, cori, eperm, eori));
        return $solution(search, posit);
    }

    return {
        /* mark2 interface */
        version: "November 22, 2011",
        initialize: ini,
        setRandomSource: setRandomSource,
        getRandomScramble: getRandomScramble,
        drawScramble: drawScramble,

        /* added methods */
        getEdgeScramble: getEdgeScramble,
        getCornerScramble: getCornerScramble,
        getLLScramble: getLLScramble,
        getLSLLScramble: getLSLLScramble
    };

})();

/*

 scramble_sq1.js

 Square-1 Solver / Scramble Generator in Javascript.

 Ported from PPT, written Walter Souza: https://bitbucket.org/walter/puzzle-timer/src/7049018bbdc7/src/com/puzzletimer/solvers/Square1Solver.java
 Ported by Lucas Garron, November 16, 2011.

 TODO:
 - Try to ini using pregenerated JSON.
 - Try to optimize arrays (byte arrays?).

 */

if (typeof scramblers == "undefined") {
    var scramblers = {};
}

scramblers["sq1"] = (function () {

    var makeArrayZeroed = function (len) {
        var array, i;
        array = new Array(len);
        for (i = 0; i < len; i++) {
            array[i] = 0;
        }
        return array;
    };

    var make2DArray = function (lenOuter, lenInner) {
        var i, outer;
        outer = new Array(lenOuter);
        for (i = 0; i < lenOuter; i++) {
            outer[i] = new Array(lenInner);
        }
        return outer;
    };

    /*
     * IndexMapping helper methods.
     */

    var IndexMappingPermutationToIndex = function (permutation) {
        var i, index, j;
        index = 0;
        if (permutation.length == 0) {
            return index;
        }
        for (i = 0; i < permutation.length - 1; i++) {
            index *= permutation.length - i;
            for (j = i + 1; j < permutation.length; j++) {
                if (permutation[i] > permutation[j]) {
                    index++;
                }
            }
        }
        if (index == 46436297) {
            iiii = 4;
        }
        return index;
    };

    var IndexMappingIndexToPermutation = function (index, length) {
        var i, j, permutation;
        permutation = new Array(length);
        permutation[length - 1] = 0;
        for (i = length - 2; i >= 0; i--) {
            permutation[i] = index % (length - i);
            index = Math.floor(index / (length - i));
            for (j = i + 1; j < length; j++) {
                if (permutation[j] >= permutation[i]) {
                    permutation[j]++;
                }
            }
        }
        return permutation;
    };

    var IndexMappingOrientationToIndex = function (orientation, nValues) {
        var i, index;
        index = 0;
        for (i = 0; i < orientation.length; i++) {
            index = nValues * index + orientation[i];
        }
        return index;
    };

    var IndexMappingNChooseK = function (n, k) {
        var i, value;
        value = 1;
        for (i = 0; i < k; i++) {
            value *= n - i;
        }
        for (i = 0; i < k; i++) {
            value /= k - i;
        }
        return value;
    };

    var IndexMappingCombinationToIndex = function (combination, k) {
        var i, index;
        index = 0;
        for (i = combination.length - 1; i >= 0 && k >= 0; i--) {
            if (combination[i]) {
                index += IndexMappingNChooseK(i, k--);
            }
        }
        return index;
    };

    var IndexMappingIndexToCombination = function (index, k, length) {
        var combination, i;
        combination = new Array(length);
        for (i = length - 1; i >= 0 && k >= 0; i--) {
            if (index >= IndexMappingNChooseK(i, k)) {
                combination[i] = true;
                index -= IndexMappingNChooseK(i, k--);
            }
        }
        return combination;
    };

    /*
     * State helper methods.
     */

    identityState = [0, 8, 1, 1, 9, 2, 2, 10, 3, 3, 11, 0, 4, 12, 5, 5, 13, 6, 6, 14, 7, 7, 15, 4];

    var stateIsTwistable = function (permutation) {
        return permutation[1] !== permutation[2] && permutation[7] !== permutation[8] && permutation[13] !== permutation[14] && permutation[19] !== permutation[20];
    };

    var stateMultiply = function (permutation, move) {
        var i, newPermutation;
        newPermutation = new Array(24);
        for (i = 0; i < 24; i++) {
            newPermutation[i] = permutation[move[i]];
        }
        return newPermutation;
    };

    var stateGetShapeIndex = function (permutation) {
        var cuts, i, next;
        cuts = new Array(24);
        for (i = 0; i < 24; i++) {
            cuts[i] = 0;
        }
        for (i = 0; i <= 11; i++) {
            next = (i + 1) % 12;
            if (permutation[i] !== permutation[next]) {
                cuts[i] = 1;
            }
        }
        for (i = 0; i <= 11; i++) {
            next = (i + 1) % 12;
            if (permutation[12 + i] !== permutation[12 + next]) {
                cuts[12 + i] = 1;
            }
        }
        return IndexMappingOrientationToIndex(cuts, 2);
    };

    var stateGetPiecesPermutation = function (permutation) {
        var i, newPermutation, next, nextSlot;
        newPermutation = new Array(16);
        nextSlot = 0;
        for (i = 0; i <= 11; i++) {
            next = (i + 1) % 12;
            if (permutation[i] !== permutation[next]) {
                newPermutation[nextSlot++] = permutation[i];
            }
        }
        for (i = 0; i <= 11; i++) {
            next = 12 + (i + 1) % 12;
            if (permutation[12 + i] !== permutation[next]) {
                newPermutation[nextSlot++] = permutation[12 + i];
            }
        }
        return newPermutation;
    };

    /*
     * Cube state helper methods.
     */

    var stateToCubeState = function (permutation) {
        var cornerIndices, cornersPermutation, edgeIndices, edgesPermutation, i;
        cornerIndices = [0, 3, 6, 9, 12, 15, 18, 21];
        cornersPermutation = new Array(8);
        for (i = 0; i < 8; i++) {
            cornersPermutation[i] = permutation[cornerIndices[i]];
        }
        edgeIndices = [1, 4, 7, 10, 13, 16, 19, 22];
        edgesPermutation = new Array(8);
        for (i = 0; i < 8; i++) {
            edgesPermutation[i] = permutation[edgeIndices[i]] - 8;
        }
        return [cornersPermutation, edgesPermutation];
    };

    var cubeStateMultiply = function (state, move) {
        var cornersPermutation, edgesPermutation, i;
        cornersPermutation = new Array(8);
        edgesPermutation = new Array(8);
        for (i = 0; i < 8; i++) {
            cornersPermutation[i] = state[0][move[0][i]];
            edgesPermutation[i] = state[1][move[1][i]];
        }
        return [cornersPermutation, edgesPermutation];
    };

    /*
     * Square-1 Solver methods.
     */

    // Private instance variables.
    var square1Solver_N_CORNERS_PERMUTATIONS = 40320;
    var square1Solver_N_CORNERS_COMBINATIONS = 70;
    var square1Solver_N_EDGES_PERMUTATIONS = 40320;
    var square1Solver_N_EDGES_COMBINATIONS = 70;
    var square1Solver_initialized = false;
    var square1Solver_shapes = new Array();
    var square1Solver_evenShapeDistance = {};
    var square1Solver_oddShapeDistance = {};
    var square1Solver_moves1 = new Array(23);
    var square1Solver_moves2;
    var square1Solver_cornersPermutationMove;
    var square1Solver_cornersCombinationMove;
    var square1Solver_edgesPermutationMove;
    var square1Solver_edgesCombinationMove;
    var square1Solver_cornersDistance;
    var square1Solver_edgesDistance;

    /*
     * If doneCallback is provided then this function will interrupt itself using timeouts.
     * This allows it to call statusCallback and doneCallback, in order to provide status update in a non-blocking UI.
     */
    var square1SolverInitialize = function (doneCallback, iniRandomSource, statusCallback) {

        setRandomSource(iniRandomSource);

        if (square1Solver_initialized) {
            if (doneCallback) {
                doneCallback();
            }
            return;
        }

        var combination, corners, depth, distanceTable, edges, fringe, i, iii, initializationLastTime, initializationStartTime, isTopCorner, isTopEdge, j, k, logStatus, move, move01, move03, move10, move30, moveTwist, moveTwistBottom, moveTwistTop, nVisited, newFringe, next, nextBottom, nextCornerPermutation, nextCornersCombination, nextEdgeCombination, nextEdgesPermutation, nextTop, result, state, statusI, _i, _len;
        initializationStartTime = new Date().getTime();
        initializationLastTime = initializationStartTime;
        statusI = 0;

        var logStatus = function (statusString) {
            var initializationCurrentTime, outString;
            statusI++;
            initializationCurrentTime = new Date().getTime();
            outString = "" + statusI + ". " + statusString + " [" + (initializationCurrentTime - initializationLastTime) + "ms split, " + (initializationCurrentTime - initializationStartTime) + "ms total]";
            initializationLastTime = initializationCurrentTime;
            //console.log(outString);
            if (statusCallback != null) {
                statusCallback(outString);
            }
        };

        var ini = 0;
        var iniParts = new Array();

        var nextIniStep = function () {
            if (!doneCallback) {
                iniParts[ini++]();
            }
            else {
                setTimeout(iniParts[ini++], 0);
            }
        }

        iniParts[ini++] = function () {

            logStatus("Initializing Square-1 Solver.");

            /* Callback Continuation */
            nextIniStep();
        };
        iniParts[ini++] = function () {

            move10 = [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
            move = move10;
            for (i = 0; i <= 10; i++) {
                square1Solver_moves1[i] = move;
                move = stateMultiply(move, move10);
            }
            move01 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 12];
            move = move01;
            for (i = 0; i <= 10; i++) {
                square1Solver_moves1[11 + i] = move;
                move = stateMultiply(move, move01);
            }
            moveTwist = [0, 1, 19, 18, 17, 16, 15, 14, 8, 9, 10, 11, 12, 13, 7, 6, 5, 4, 3, 2, 20, 21, 22, 23];
            square1Solver_moves1[22] = moveTwist;

            logStatus("Generating shape tables.");
            /* Callback Continuation */
            nextIniStep();
        };
        iniParts[ini++] = function () {

            square1Solver_evenShapeDistance[stateGetShapeIndex(identityState)] = 0;
            fringe = new Array();
            fringe.push(identityState);
            iii = 0;
            depth = 0;
            while (fringe.length > 0) {
                newFringe = new Array();
                for (_i = 0, _len = fringe.length; _i < _len; _i++) {
                    state = fringe[_i];
                    if (stateIsTwistable(state)) {
                        square1Solver_shapes.push(state);
                    }
                    for (i = 0; i < square1Solver_moves1.length; i++) {
                        if (!(i == 22 && !stateIsTwistable(state))) {
                            next = stateMultiply(state, square1Solver_moves1[i]);
                            distanceTable = null;
                            if (isEvenPermutation(stateGetPiecesPermutation(next))) {
                                distanceTable = square1Solver_evenShapeDistance;
                            } else {
                                distanceTable = square1Solver_oddShapeDistance;
                            }
                            if (!(distanceTable[stateGetShapeIndex(next)] != null)) {
                                distanceTable[stateGetShapeIndex(next)] = depth + 1;
                                newFringe.push(next);
                            }
                        }
                    }
                }
                fringe = newFringe;
                depth++;
                if (depth == 10 || depth == 12 || depth == 15) {
                    logStatus("Shape Table Depth: " + depth + "/20");
                }
            }
            move30 = [
                [3, 0, 1, 2, 4, 5, 6, 7],
                [3, 0, 1, 2, 4, 5, 6, 7]
            ];
            move03 = [
                [0, 1, 2, 3, 5, 6, 7, 4],
                [0, 1, 2, 3, 5, 6, 7, 4]
            ];
            moveTwistTop = [
                [0, 6, 5, 3, 4, 2, 1, 7],
                [6, 5, 2, 3, 4, 1, 0, 7]
            ];
            moveTwistBottom = [
                [0, 6, 5, 3, 4, 2, 1, 7],
                [0, 5, 4, 3, 2, 1, 6, 7]
            ];
            square1Solver_moves2 = [move30, cubeStateMultiply(move30, move30), cubeStateMultiply(cubeStateMultiply(move30, move30), move30), move03, cubeStateMultiply(move03, move03), cubeStateMultiply(cubeStateMultiply(move03, move03), move03), moveTwistTop, moveTwistBottom];


            logStatus("Generating move tables.");
            /* Callback Continuation */
            nextIniStep();
        };
        iniParts[ini++] = function () {

            logStatus("Corner permutation move table...");
            /* Callback Continuation */
            nextIniStep();
        };
        iniParts[ini++] = function () {

            square1Solver_cornersPermutationMove = make2DArray(square1Solver_N_CORNERS_PERMUTATIONS, square1Solver_moves2.length);
            for (i = 0; i < square1Solver_N_CORNERS_PERMUTATIONS; i++) {
                state = [IndexMappingIndexToPermutation(i, 8), makeArrayZeroed(8)];
                for (j = 0; j < square1Solver_moves2.length; j++) {
                    square1Solver_cornersPermutationMove[i][j] = IndexMappingPermutationToIndex(cubeStateMultiply(state, square1Solver_moves2[j])[0]);
                }
            }

            logStatus("Corner combination move table...");
            /* Callback Continuation */
            nextIniStep();
        };
        iniParts[ini++] = function () {

            square1Solver_cornersCombinationMove = make2DArray(square1Solver_N_CORNERS_COMBINATIONS, square1Solver_moves2.length);
            for (i = 0; i < square1Solver_N_CORNERS_COMBINATIONS; i++) {
                combination = IndexMappingIndexToCombination(i, 4, 8);
                corners = new Array(8);
                nextTop = 0;
                nextBottom = 4;
                for (j = 0; j < 8; j++) {
                    if (combination[j]) {
                        corners[j] = nextTop++;
                    } else {
                        corners[j] = nextBottom++;
                    }
                }
                state = [corners, new Array(8)];
                for (j = 0; j < square1Solver_moves2.length; j++) {
                    result = cubeStateMultiply(state, square1Solver_moves2[j]);
                    isTopCorner = new Array(8);
                    for (k = 0; k < 8; k++) {
                        isTopCorner[k] = result[0][k] < 4;
                    }
                    square1Solver_cornersCombinationMove[i][j] = IndexMappingCombinationToIndex(isTopCorner, 4);
                }
            }

            logStatus("Edges permutation move table...");
            /* Callback Continuation */
            nextIniStep();
        };
        iniParts[ini++] = function () {

            square1Solver_edgesPermutationMove = make2DArray(square1Solver_N_EDGES_PERMUTATIONS, square1Solver_moves2.length);
            for (i = 0; i < square1Solver_N_EDGES_PERMUTATIONS; i++) {
                state = [makeArrayZeroed(8), IndexMappingIndexToPermutation(i, 8)];
                for (j = 0; j < square1Solver_moves2.length; j++) {
                    square1Solver_edgesPermutationMove[i][j] = IndexMappingPermutationToIndex(cubeStateMultiply(state, square1Solver_moves2[j])[1]);
                    //console.log(":" + square1Solver_edgesPermutationMove[i][j] + ", " + state.toString() + ", " + square1Solver_moves2[j] + ", " + cubeStateMultiply(state, square1Solver_moves2[j]).toString());
                }
            }

            logStatus("Edges combination move table...");
            /* Callback Continuation */
            nextIniStep();
        };
        iniParts[ini++] = function () {

            square1Solver_edgesCombinationMove = make2DArray(square1Solver_N_EDGES_COMBINATIONS, square1Solver_moves2.length);
            for (i = 0; i < square1Solver_N_EDGES_COMBINATIONS; i++) {
                combination = IndexMappingIndexToCombination(i, 4, 8);
                edges = new Array(8);
                nextTop = 0;
                nextBottom = 4;
                for (j = 0; j < 8; j++) {
                    if (combination[j]) {
                        edges[j] = nextTop++;
                    } else {
                        edges[j] = nextBottom++;
                    }
                }
                state = [new Array(8), edges];
                for (j = 0; j < square1Solver_moves2.length; j++) {
                    result = cubeStateMultiply(state, square1Solver_moves2[j]);
                    isTopEdge = new Array(8);
                    for (k = 0; k < 8; k++) {
                        isTopEdge[k] = result[1][k] < 4;
                    }
                    square1Solver_edgesCombinationMove[i][j] = IndexMappingCombinationToIndex(isTopEdge, 4);
                }
            }

            logStatus("Generating prune tables.");
            /* Callback Continuation */
            nextIniStep();
        };
        iniParts[ini++] = function () {

            logStatus("Corners distance prune table...");
            /* Callback Continuation */
            nextIniStep();
        };
        iniParts[ini++] = function () {

            square1Solver_cornersDistance = make2DArray(square1Solver_N_CORNERS_PERMUTATIONS, square1Solver_N_EDGES_COMBINATIONS);
            for (i = 0; i < square1Solver_N_CORNERS_PERMUTATIONS; i++) {
                for (j = 0; j < square1Solver_N_EDGES_COMBINATIONS; j++) {
                    square1Solver_cornersDistance[i][j] = -1;
                }
            }
            square1Solver_cornersDistance[0][0] = 0;
            while (true) {
                nVisited = 0;
                for (i = 0; i < square1Solver_N_CORNERS_PERMUTATIONS; i++) {
                    for (j = 0; j < square1Solver_N_EDGES_COMBINATIONS; j++) {
                        if (square1Solver_cornersDistance[i][j] == depth) {
                            for (k = 0; k < square1Solver_moves2.length; k++) {
                                nextCornerPermutation = square1Solver_cornersPermutationMove[i][k];
                                nextEdgeCombination = square1Solver_edgesCombinationMove[j][k];
                                if (square1Solver_cornersDistance[nextCornerPermutation][nextEdgeCombination] < 0) {
                                    con;
                                    square1Solver_cornersDistance[nextCornerPermutation][nextEdgeCombination] = depth + 1;
                                    nVisited++;
                                }
                            }
                        }
                    }
                }
                depth++;
                if (!(nVisited > 0)) {
                    break;
                }
            }

            logStatus("Edges distance prune table...");
            /* Callback Continuation */
            nextIniStep();
        };
        iniParts[ini++] = function () {

            square1Solver_edgesDistance = make2DArray(square1Solver_N_EDGES_PERMUTATIONS, square1Solver_N_CORNERS_COMBINATIONS);
            for (i = 0; i < square1Solver_N_EDGES_PERMUTATIONS; i++) {
                for (j = 0; j < square1Solver_N_CORNERS_COMBINATIONS; j++) {
                    square1Solver_edgesDistance[i][j] = -1;
                }
            }
            square1Solver_edgesDistance[0][0] = 0;

            depth = 0;
            while (true) {
                nVisited = 0;
                for (i = 0; i < square1Solver_N_EDGES_PERMUTATIONS; i++) {
                    for (j = 0; j < square1Solver_N_CORNERS_COMBINATIONS; j++) {
                        if (square1Solver_edgesDistance[i][j] == depth) {
                            for (k = 0; k < square1Solver_moves2.length; k++) {
                                nextEdgesPermutation = square1Solver_edgesPermutationMove[i][k];
                                nextCornersCombination = square1Solver_cornersCombinationMove[j][k];
                                if (square1Solver_edgesDistance[nextEdgesPermutation][nextCornersCombination] < 0) {
                                    square1Solver_edgesDistance[nextEdgesPermutation][nextCornersCombination] = depth + 1;
                                    nVisited++;
                                }
                            }
                        }
                    }
                }
                depth++;
                if (!(nVisited > 0)) {
                    break;
                }
            }

            logStatus("Done initializing Square-1 Solver.");
            /* Callback Continuation */
            nextIniStep();
        };
        iniParts[ini++] = function () {

            square1Solver_initialized = true;
            if (doneCallback != null) {
                doneCallback();
            }
        }

        ini = 0;
        nextIniStep();
    };

    var topIndexToAmount = function (index) {
        return (index == -1) ? 0 : index + 1;
    }

    var bottomIndexToAmount = function (index) {
        return (index == -1) ? 0 : index - 10;
    }

    var topAmountToIndex = function (amount) {
        return (amount == 0) ? -1 : amount - 1;
    }

    var bottomAmountToIndex = function (amount) {
        return (amount == 0) ? -1 : amount + 10;
    }

    /*
     * - Converts to the format [top, bottom, /, top, bottom, /, ..., top, bottom]
     *  - This creates redundant moves, but those don't matter in square1SolverSolutionToString(...).
     * - Converts adjacent non-/ moves into (top, bottom). (even if one of these is 0)
     * - collapses consecutive / moves.
     */
    var square1SolverNormalizeSolution = function (solution) {
        var bottom, moveIndex, newSolution, top, _i, _len;
        newSolution = new Array();
        top = 0;
        bottom = 0;
        for (i = 0; i < solution.length; i++) {
            moveIndex = solution[i];
            if (moveIndex < 11) {
                top += moveIndex + 1;
                top %= 12;
            } else if (moveIndex < 22) {
                bottom += (moveIndex - 11) + 1;
                bottom %= 12;
            } else {
                if (solution[i - 1] == 22) {
                    newSolution.pop();
                    bottom = bottomIndexToAmount(newSolution.pop());
                    top = topIndexToAmount(newSolution.pop());
                }
                else {
                    newSolution.push(topAmountToIndex(top));
                    newSolution.push(bottomAmountToIndex(bottom));
                    newSolution.push(22);
                    top = 0;
                    bottom = 0;
                }
            }
        }
        newSolution.push(topAmountToIndex(top));
        newSolution.push(bottomAmountToIndex(bottom));
        return newSolution;
    };

    var square1SolverSolutionEnsureMiddleParity = function (solution, middleIsSolved) {
        var simplifiedSolution = square1SolverNormalizeSolution(solution);
        var location60 = -1;
        var locationM0 = -1;
        var locationMN = -1;
        //console.log(square1SolverSolutionToString(solution).join(""));
        for (i = 0; i < simplifiedSolution.length - 2; i += 3) {
            if (!((0 <= simplifiedSolution[i] < 11 || simplifiedSolution[i] == -1) && (11 <= simplifiedSolution[i + 2] < 22 || simplifiedSolution[i + 2] == -1) && (simplifiedSolution[i + 2] == 22))) {
                console.error("Improperly simplified (see indices " + i + " to " + (i + 2) + "):" + simplifiedSolution); // Sanity check.
            }
            if (simplifiedSolution[i + 1] != 0) {
                locationMN = i;
            }
            else if (simplifiedSolution[i] != 6) {
                locationM0 = i;
            }
            else {
                location60 = i;
            }
        }
        if (!((0 <= simplifiedSolution[simplifiedSolution.length - 1] < 11 || simplifiedSolution[simplifiedSolution.length - 2] == -1) && (11 <= simplifiedSolution[simplifiedSolution.length - 2] < 22 || simplifiedSolution[simplifiedSolution.length - 1] == -1))) {
            console.error("Improperly simplified (see indices " + (simplifiedSolution.length - 2) + " to " + (simplifiedSolution.length - 1) + "):" + solution); // Sanity check.
        }

        // After sanity checks:
        if (((simplifiedSolution.length - 2) / 3 % 2 == 0) == middleIsSolved) {
            //console.log("Middle parity is correct.");
            return solution;
        }

        var location = location60;
        if (location == -1) {
            location = locationM0;
        }
        if (location == -1) {
            location = locationMN;
        }

        //console.log("Reversing middle parity at location " + i + ".");
        simplifiedSolution.splice(location + 2, 1, 5, 22, 5, 22, 5);
        simplifiedSolution = square1SolverNormalizeSolution(simplifiedSolution);
        //console.log(square1SolverSolutionToString(simplifiedSolution).join(""));
        return simplifiedSolution;
    };

    var square1SolverSolutionToString = function (solution) {
        var bottom, moveIndex, sequence, top, _i, _len;
        sequence = new Array();
        top = 0;
        bottom = 0;
        for (i = 0; i < solution.length; i++) {
            moveIndex = solution[i];
            if (moveIndex == -1) {
                // Nothing.
            }
            if (moveIndex < 11) {
                top += moveIndex + 1;
                top %= 12;
            } else if (moveIndex < 22) {
                bottom += (moveIndex - 11) + 1;
                bottom %= 12;
            } else {
                if (top !== 0 || bottom !== 0) {
                    if (top > 6) {
                        top = -(12 - top);
                    }
                    if (bottom > 6) {
                        bottom = -(12 - bottom);
                    }
                    sequence.push("(" + top + ", ", bottom + ")");
                    top = 0;
                    bottom = 0;
                }
                sequence.push(" / ");
            }
        }
        if (top !== 0 || bottom !== 0) {
            if (top > 6) {
                top = -(12 - top);
            }
            if (bottom > 6) {
                bottom = -(12 - bottom);
            }
            sequence.push("(" + top + ", ", bottom + ")");
        }
        return sequence;
    }

    var square1SolverSolve = function (position) {
        var solution = square1SolverSolution(position);
        return square1SolverSolutionToString(solution);
    };

    var square1SolverGenerate = function (position) {
        var solution = square1SolverSolution(position);
        //console.log("FF: "+ solution);
        var newSolution = [];
        for (i = solution.length - 1; i >= 0; i--) {
            var move = solution[i];
            if (move < 0) {
                newSolution.push(-1);
            }
            else if (move < 11) {
                newSolution.push(10 - move);
            }
            else if (move < 22) {
                newSolution.push(32 - move);
            }
            else {
                newSolution.push(move);
            }
        }
        //console.log("FF2: "+ newSolution);
        return square1SolverSolutionToString(newSolution);
    };

    var square1SolverSolution = function (position) {
        var depth, moveIndex, phase1MoveIndex, phase2MoveMapping, sequence, solution1, solution2, _i, _j, _k, _len, _len2, _len3, _ref, _results;
        if (!square1Solver_initialized) {
            square1SolverInitialize();
        }
        depth = 0;
        _results = [];
        while (true) {
            solution1 = new Array();
            solution2 = new Array();
            if (square1SolverSearch(position["permutation"], isEvenPermutation(stateGetPiecesPermutation(position["permutation"])), depth, solution1, solution2)) {
                sequence = new Array();

                //console.log("L1: " + solution1.length);
                //console.log("L2: " + solution2.length);

                for (_i = 0, _len = solution1.length; _i < _len; _i++) {
                    moveIndex = solution1[_i];
                    sequence.push(moveIndex);
                }
                phase2MoveMapping = [
                    [2],
                    [5],
                    [8],
                    [13],
                    [16],
                    [19],
                    [0, 22, 10],
                    [21, 22, 11]
                ];
                for (_j = 0, _len2 = solution2.length; _j < _len2; _j++) {
                    moveIndex = solution2[_j];
                    _ref = phase2MoveMapping[moveIndex];
                    for (_k = 0, _len3 = _ref.length; _k < _len3; _k++) {
                        phase1MoveIndex = _ref[_k];
                        sequence.push(phase1MoveIndex);
                    }
                }
                //console.log("TT1: " + square1SolverSolutionToString(sequence).join(""));
                //console.log("TT1a: " + sequence);
                sequence = square1SolverSolutionEnsureMiddleParity(sequence, position["middleIsSolved"]);
                //console.log("TT2: " + square1SolverSolutionToString(sequence).join(""));
                //console.log("TT2a: " + sequence);
                return sequence;
            }
            depth++;
        }
        return _results;
    };

    var square1SolverSearch = function (state, stateIsEvenPermutation, depth, solution1, solution2) {
        var distance, i, m, next, sequence2, _i, _len;
        if (depth == 0) {
            if (stateIsEvenPermutation && (stateGetShapeIndex(state) == stateGetShapeIndex(identityState))) {
                sequence2 = square1SolverSolution2(stateToCubeState(state), 17);
                if (sequence2 !== null) {
                    for (_i = 0, _len = sequence2.length; _i < _len; _i++) {
                        m = sequence2[_i];
                        solution2.push(m);
                    }
                    return true;
                }
            }
            return false;
        }
        distance = null;
        if (stateIsEvenPermutation) {
            distance = square1Solver_evenShapeDistance[stateGetShapeIndex(state)];
        } else {
            distance = square1Solver_oddShapeDistance[stateGetShapeIndex(state)];
        }
        if (distance <= depth) {
            for (i = 0; i < square1Solver_moves1.length; i++) {
                if (!(i == 22 && !stateIsTwistable(state))) {
                    next = stateMultiply(state, square1Solver_moves1[i]);
                    solution1.push(i);
                    if (square1SolverSearch(next, isEvenPermutation(stateGetPiecesPermutation(next)), depth - 1, solution1, solution2)) {
                        return true;
                    }
                    solution1.length -= 1;
                }
            }
        }
        return false;
    };

    var square1SolverSolution2 = function (state, maxDepth) {
        var cornersCombination, cornersPermutation, depth, edgesCombination, edgesPermutation, isTopCorner, isTopEdge, k, solution;
        cornersPermutation = IndexMappingPermutationToIndex(state[0]);
        isTopCorner = new Array(8);
        for (k = 0; k < 8; k++) {
            isTopCorner[k] = state[0][k] < 4;
        }
        cornersCombination = IndexMappingCombinationToIndex(isTopCorner, 4);
        edgesPermutation = IndexMappingPermutationToIndex(state[1]);
        isTopEdge = new Array(8);
        for (k = 0; k < 8; k++) {
            isTopEdge[k] = state[1][k] < 4;
        }
        edgesCombination = IndexMappingCombinationToIndex(isTopEdge, 4);
        for (depth = 0; depth < maxDepth + 1; depth++) {
            solution = makeArrayZeroed(depth);
            //console.log("Oink: " + cornersPermutation + ", " + cornersCombination + ", " + edgesPermutation + ", " + edgesCombination + ", " + depth + ", " + solution.toString());
            if (square1SolverSearch2(cornersPermutation, cornersCombination, edgesPermutation, edgesCombination, depth, solution)) {
                return solution;
            }
        }
        return null;
    };

    var square1SolverSearch2 = function (cornersPermutation, cornersCombination, edgesPermutation, edgesCombination, depth, solution) {
        //var input = "Search 2 ini: " + cornersPermutation + ", " + cornersCombination + ", " + edgesPermutation + ", " + edgesCombination + ", " + depth + ", " + solution.toString();

        var i;
        if (depth == 0) {
            return (cornersPermutation == 0) && (edgesPermutation == 0);
        }
        if ((square1Solver_cornersDistance[cornersPermutation][edgesCombination] <= depth) && (square1Solver_edgesDistance[edgesPermutation][cornersCombination] <= depth)) {
            for (i = 0; i < square1Solver_moves2.length; i++) {
                if (!((solution.length - depth - 1 >= 0) && (Math.floor(solution[solution.length - depth - 1] / 3) == Math.floor(i / 3)))) {
                    solution[solution.length - depth] = i;
                    if (square1SolverSearch2(square1Solver_cornersPermutationMove[cornersPermutation][i], square1Solver_cornersCombinationMove[cornersCombination][i], square1Solver_edgesPermutationMove[edgesPermutation][i], square1Solver_edgesCombinationMove[edgesCombination][i], depth - 1, solution)) {
                        //console.log("Search 2 subfinal: " + input);
                        //console.log("Search 2 final: " + cornersPermutation + ", " + cornersCombination + ", " + edgesPermutation + ", " + edgesCombination + ", " + depth + ", " + solution.toString());

                        return true;
                    }
                }
            }
        }
        return false;
    };

    var square1SolverGetRandomPosition = function () {
        var cornersPermutation, edgesPermutation, i, permutation, shape, middleIsSolved;
        if (!square1Solver_initialized) {
            square1SolverInitialize();
        }
        shape = square1Solver_shapes[randomIntBelow(square1Solver_shapes.length)];
        cornersPermutation = IndexMappingIndexToPermutation(randomIntBelow(square1Solver_N_CORNERS_PERMUTATIONS), 8);
        edgesPermutation = IndexMappingIndexToPermutation(randomIntBelow(square1Solver_N_EDGES_PERMUTATIONS), 8);
        permutation = new Array(shape.length);
        for (i = 0; i < shape.length; i++) {
            if (shape[i] < 8) {
                permutation[i] = cornersPermutation[shape[i]];
            } else {
                permutation[i] = 8 + edgesPermutation[shape[i] - 8];
            }
        }
        middleIsSolved = (randomIntBelow(2) == 1) ? true : false;
        return {"permutation": permutation, "middleIsSolved": middleIsSolved};
    };

    /*
     * Some helper functions.
     */

    var square1SolverRandomSource = undefined;

    // If we have a better (P)RNG:
    var setRandomSource = function (src) {
        square1SolverRandomSource = src;
    }

    var randomIntBelow = function (n) {
        return Math.floor(square1SolverRandomSource.random() * n);
    };

    var isEvenPermutation = function (permutation) {
        var i, j, nInversions;
        nInversions = 0;
        for (i = 0; i < permutation.length; i++) {
            for (j = i + 1; j < permutation.length; j++) {
                if (permutation[i] > permutation[j]) {
                    nInversions++;
                }
            }
        }
        return nInversions % 2 == 0;
    };

    var square1SolverGetRandomScramble = function () {
        var randomState = square1SolverGetRandomPosition();
        var scrambleString = square1SolverGenerate(randomState).join("");

        return {
            state: randomState,
            scramble: scrambleString
        };
    }

    /*
     * Drawing methods. These are extremely messy and outdated by now, but at least they work.
     */


    function colorGet(col) {
        if (col == "r") return ("#FF0000");
        if (col == "o") return ("#FF8000");
        if (col == "b") return ("#0000FF");
        if (col == "g") return ("#00FF00");
        if (col == "y") return ("#FFFF00");
        if (col == "w") return ("#FFFFFF");
        if (col == "x") return ("#000000");
    }

    function drawPolygon(r, fillColor, arrx, arry) {

        var pathString = "";
        for (var i = 0; i < arrx.length; i++) {
            pathString += ((i == 0) ? "M" : "L") + arrx[i] + "," + arry[i];
        }
        pathString += "z";

        r.path(pathString).attr({fill: colorGet(fillColor), stroke: "#000"})
    }


    function drawSq(stickers, middleIsSolved, shapes, parentElement, colorString) {

        var z = 1.366 // sqrt(2) / sqrt(1^2 + tan(15 degrees)^2)
        var r = Raphael(parentElement, 200, 110);
        parentElement.width = 200;

        var arrx, arry;

        var margin = 1;
        var sidewid = .15 * 100 / z;
        var cx = 50;
        var cy = 50;
        var radius = (cx - margin - sidewid * z) / z;
        var w = (sidewid + radius) / radius   // ratio btw total piece width and radius

        var angles = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var angles2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        //initialize angles
        for (var foo = 0; foo < 24; foo++) {
            angles[foo] = (17 - foo * 2) / 12 * Math.PI;
            shapes = shapes.concat("xxxxxxxxxxxxxxxx");
        }
        for (var foo = 0; foo < 24; foo++) {
            angles2[foo] = (19 - foo * 2) / 12 * Math.PI;
            shapes = shapes.concat("xxxxxxxxxxxxxxxx");
        }

        function cos1(index) {
            return Math.cos(angles[index]) * radius;
        }

        function sin1(index) {
            return Math.sin(angles[index]) * radius;
        }

        function cos2(index) {
            return Math.cos(angles2[index]) * radius;
        }

        function sin2(index) {
            return Math.sin(angles2[index]) * radius;
        }

        var h = sin1(1) * w * z - sin1(1) * z;
        if (middleIsSolved) {
            arrx = [cx + cos1(1) * w * z, cx + cos1(4) * w * z, cx + cos1(7) * w * z, cx + cos1(10) * w * z];
            arry = [cy - sin1(1) * w * z, cy - sin1(4) * w * z, cy - sin1(7) * w * z, cy - sin1(10) * w * z];
            drawPolygon(r, "x", arrx, arry);

            cy += 10;
            arrx = [cx + cos1(0) * w, cx + cos1(0) * w, cx + cos1(1) * w * z, cx + cos1(1) * w * z];
            arry = [cy - sin1(1) * w * z, cy - sin1(1) * z, cy - sin1(1) * z, cy - sin1(1) * w * z, cy - sin1(1) * w * z];
            drawPolygon(r, colorString[5], arrx, arry)

            arrx = [cx + cos1(0) * w, cx + cos1(0) * w, cx + cos1(10) * w * z, cx + cos1(10) * w * z];
            arry = [cy - sin1(1) * w * z, cy - sin1(1) * z, cy - sin1(1) * z, cy - sin1(1) * w * z, cy - sin1(1) * w * z];
            drawPolygon(r, colorString[5], arrx, arry)
            cy -= 10;
        }
        else {
            arrx = [cx + cos1(1) * w * z, cx + cos1(4) * w * z, cx + cos1(6) * w, cx + cos1(9) * w * z, cx + cos1(11) * w * z, cx + cos1(0) * w];
            arry = [cy - sin1(1) * w * z, cy - sin1(4) * w * z, cy - sin1(6) * w, cy + sin1(9) * w * z, cy - sin1(11) * w * z, cy - sin1(0) * w];
            drawPolygon(r, "x", arrx, arry);

            arrx = [cx + cos1(9) * w * z, cx + cos1(11) * w * z, cx + cos1(11) * w * z, cx + cos1(9) * w * z];
            arry = [cy + sin1(9) * w * z - h, cy - sin1(11) * w * z - h, cy - sin1(11) * w * z, cy + sin1(9) * w * z];
            drawPolygon(r, colorString[4], arrx, arry);

            cy += 10;
            arrx = [cx + cos1(0) * w, cx + cos1(0) * w, cx + cos1(1) * w * z, cx + cos1(1) * w * z];
            arry = [cy - sin1(1) * w * z, cy - sin1(1) * z, cy - sin1(1) * z, cy - sin1(1) * w * z];
            drawPolygon(r, colorString[5], arrx, arry)

            arrx = [cx + cos1(0) * w, cx + cos1(0) * w, cx + cos1(11) * w * z, cx + cos1(11) * w * z];
            arry = [cy - sin1(1) * w * z, cy - sin1(1) * z, cy - sin1(11) * w * z + h, cy - sin1(11) * w * z];
            drawPolygon(r, colorString[2], arrx, arry)
            cy -= 10;
        }

        //fill and outline first layer
        var sc = 0;
        for (var foo = 0; sc < 12; foo++) {
            if (shapes.length <= foo) sc = 12;
            if (shapes.charAt(foo) == "x") sc++;
            if (shapes.charAt(foo) == "c") {
                arrx = [cx, cx + cos1(sc), cx + cos1(sc + 1) * z, cx + cos1(sc + 2)];
                arry = [cy, cy - sin1(sc), cy - sin1(sc + 1) * z, cy - sin1(sc + 2)];
                drawPolygon(r, stickers.charAt(foo), arrx, arry)

                arrx = [cx + cos1(sc), cx + cos1(sc + 1) * z, cx + cos1(sc + 1) * w * z, cx + cos1(sc) * w];
                arry = [cy - sin1(sc), cy - sin1(sc + 1) * z, cy - sin1(sc + 1) * w * z, cy - sin1(sc) * w];
                drawPolygon(r, stickers.charAt(16 + sc), arrx, arry)

                arrx = [cx + cos1(sc + 2), cx + cos1(sc + 1) * z, cx + cos1(sc + 1) * w * z, cx + cos1(sc + 2) * w];
                arry = [cy - sin1(sc + 2), cy - sin1(sc + 1) * z, cy - sin1(sc + 1) * w * z, cy - sin1(sc + 2) * w];
                drawPolygon(r, stickers.charAt(17 + sc), arrx, arry)

                sc += 2;
            }
            if (shapes.charAt(foo) == "e") {
                arrx = [cx, cx + cos1(sc), cx + cos1(sc + 1)];
                arry = [cy, cy - sin1(sc), cy - sin1(sc + 1)];
                drawPolygon(r, stickers.charAt(foo), arrx, arry)

                arrx = [cx + cos1(sc), cx + cos1(sc + 1), cx + cos1(sc + 1) * w, cx + cos1(sc) * w];
                arry = [cy - sin1(sc), cy - sin1(sc + 1), cy - sin1(sc + 1) * w, cy - sin1(sc) * w];
                drawPolygon(r, stickers.charAt(16 + sc), arrx, arry)

                sc += 1;
            }
        }

        //fill and outline second layer
        cx += 100;
        cy += 10;


        var h = sin1(1) * w * z - sin1(1) * z;
        if (middleIsSolved) {
            arrx = [cx + cos1(1) * w * z, cx + cos1(4) * w * z, cx + cos1(7) * w * z, cx + cos1(10) * w * z];
            arry = [cy + sin1(1) * w * z, cy + sin1(4) * w * z, cy + sin1(7) * w * z, cy + sin1(10) * w * z];
            drawPolygon(r, "x", arrx, arry);

            cy -= 10;
            arrx = [cx + cos1(0) * w, cx + cos1(0) * w, cx + cos1(1) * w * z, cx + cos1(1) * w * z];
            arry = [cy + sin1(1) * w * z, cy + sin1(1) * z, cy + sin1(1) * z, cy + sin1(1) * w * z, cy + sin1(1) * w * z];
            drawPolygon(r, colorString[5], arrx, arry)

            arrx = [cx + cos1(0) * w, cx + cos1(0) * w, cx + cos1(10) * w * z, cx + cos1(10) * w * z];
            arry = [cy + sin1(1) * w * z, cy + sin1(1) * z, cy + sin1(1) * z, cy + sin1(1) * w * z, cy + sin1(1) * w * z];
            drawPolygon(r, colorString[5], arrx, arry)
            cy += 10;
        }
        else {
            arrx = [cx + cos1(1) * w * z, cx + cos1(4) * w * z, cx + cos1(6) * w, cx + cos1(9) * w * z, cx + cos1(11) * w * z, cx + cos1(0) * w];
            arry = [cy + sin1(1) * w * z, cy + sin1(4) * w * z, cy + sin1(6) * w, cy - sin1(9) * w * z, cy + sin1(11) * w * z, cy + sin1(0) * w];
            drawPolygon(r, "x", arrx, arry);

            arrx = [cx + cos1(9) * w * z, cx + cos1(11) * w * z, cx + cos1(11) * w * z, cx + cos1(9) * w * z];
            arry = [cy - sin1(9) * w * z + h, cy + sin1(11) * w * z + h, cy + sin1(11) * w * z, cy - sin1(9) * w * z];
            drawPolygon(r, colorString[4], arrx, arry);

            cy -= 10;
            arrx = [cx + cos1(0) * w, cx + cos1(0) * w, cx + cos1(1) * w * z, cx + cos1(1) * w * z];
            arry = [cy + sin1(1) * w * z, cy + sin1(1) * z, cy + sin1(1) * z, cy + sin1(1) * w * z];
            drawPolygon(r, colorString[5], arrx, arry)

            arrx = [cx + cos1(0) * w, cx + cos1(0) * w, cx + cos1(11) * w * z, cx + cos1(11) * w * z];
            arry = [cy + sin1(1) * w * z, cy + sin1(1) * z, cy + sin1(11) * w * z - h, cy + sin1(11) * w * z];
            drawPolygon(r, colorString[2], arrx, arry)
            cy += 10;
        }

        var sc = 0;
        for (sc = 0; sc < 12; foo++) {
            if (shapes.length <= foo) sc = 12;
            if (shapes.charAt(foo) == "x") sc++;
            if (shapes.charAt(foo) == "c") {
                arrx = [cx, cx + cos2(sc), cx + cos2(sc + 1) * z, cx + cos2(sc + 2)];
                arry = [cy, cy - sin2(sc), cy - sin2(sc + 1) * z, cy - sin2(sc + 2)];
                drawPolygon(r, stickers.charAt(foo), arrx, arry)

                arrx = [cx + cos2(sc), cx + cos2(sc + 1) * z, cx + cos2(sc + 1) * w * z, cx + cos2(sc) * w];
                arry = [cy - sin2(sc), cy - sin2(sc + 1) * z, cy - sin2(sc + 1) * w * z, cy - sin2(sc) * w];
                drawPolygon(r, stickers.charAt(28 + sc), arrx, arry)

                arrx = [cx + cos2(sc + 2), cx + cos2(sc + 1) * z, cx + cos2(sc + 1) * w * z, cx + cos2(sc + 2) * w];
                arry = [cy - sin2(sc + 2), cy - sin2(sc + 1) * z, cy - sin2(sc + 1) * w * z, cy - sin2(sc + 2) * w];
                drawPolygon(r, stickers.charAt(29 + sc), arrx, arry)

                sc += 2;

            }
            if (shapes.charAt(foo) == "e") {
                arrx = [cx, cx + cos2(sc), cx + cos2(sc + 1)];
                arry = [cy, cy - sin2(sc), cy - sin2(sc + 1)];
                drawPolygon(r, stickers.charAt(foo), arrx, arry)

                arrx = [cx + cos2(sc), cx + cos2(sc + 1), cx + cos2(sc + 1) * w, cx + cos2(sc) * w];
                arry = [cy - sin2(sc), cy - sin2(sc + 1), cy - sin2(sc + 1) * w, cy - sin2(sc) * w];
                drawPolygon(r, stickers.charAt(28 + sc), arrx, arry)

                sc += 1;
            }
        }

    }

    var remove_duplicates = function (arr) {
        var out = [];
        var j = 0;
        for (var i = 0; i < arr.length; i++) {
            if (i == 0 || arr[i] != arr[i - 1])
                out[j++] = arr[i];
        }
        return out;
    }

    var drawScramble = function (parentElement, state) {

        var colorString = "yobwrg";  //In dlburf order.

        var posit;
        var scrambleString;
        var tb, ty, col, eido;

        var permutation = state["permutation"];
        var middleIsSolved = state["middleIsSolved"];

        var posit = [];
        var map = [8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 13, 12, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14];
        for (j in map) {
            posit.push(permutation[map[j]]);
        }

        var tb = ["3", "3", "3", "3", "0", "0", "0", "0", "3", "3", "3", "3", "0", "0", "0", "0"];
        ty = ["c", "c", "c", "c", "c", "c", "c", "c", "e", "e", "e", "e", "e", "e", "e", "e"];
        col = ["12", "24", "45", "51", "21", "42", "54", "15", "2", "4", "5", "1", "2", "4", "5", "1"];

        var top_side = remove_duplicates(posit.slice(0, 12));
        var bot_side = remove_duplicates(posit.slice(18, 24).concat(posit.slice(12, 18)));
        var eido = top_side.concat(bot_side);

        var a = "";
        var b = "";
        var c = "";
        var eq = "_";
        for (var j = 0; j < 16; j++) {
            a += ty[eido[j]];
            eq = eido[j];
            b += tb[eido[j]];
            c += col[eido[j]];
        }

        var stickers = (b.concat(c)
            .replace(/0/g, colorString[0])
            .replace(/1/g, colorString[1])
            .replace(/2/g, colorString[2])
            .replace(/3/g, colorString[3])
            .replace(/4/g, colorString[4])
            .replace(/5/g, colorString[5])
            );
        drawSq(stickers, middleIsSolved, a, parentElement, colorString);

    }

    /*
     * Export public methods.
     */

    return {

        /* mark2 interface */
        version: "November 22, 2011",
        initialize: square1SolverInitialize,
        setRandomSource: setRandomSource,
        getRandomScramble: square1SolverGetRandomScramble,
        drawScramble: drawScramble,

        /* Other methods */
        getRandomPosition: square1SolverGetRandomPosition,
        solve: square1SolverSolve,
        senerate: square1SolverGenerate  };

})();

// #################### SCRAMBLING ####################


var seq = [];
var p = [];
var ss = [];
var type = "333";
var len = 0;
var num = 1;
var cubesuff = ["", "2", "'"];
var minxsuff = ["", "2", "'", "2'"];

// data for all scramblers
var scrdata = [
    ["===WCA PUZZLES===", [
        ["--", "blank", 0]
    ]],
    ["2x2x2", [
        ["random state", "222so", 11],
        ["optimal random state", "222o", 0],
        ["3-gen", "2223", 25],
        ["6-gen", 2226, 25]
    ]],
    ["3x3x3", [
        ["random state", "333", 0],
        ["old style", "333o", 25]
    ]],
    ["4x4x4", [
        ["WCA", "444wca", 40],
        ["SiGN", "444", 40],
        ["YJ (place fixed center on Urf)", "444yj", 40]
    ]],
    ["5x5x5", [
        ["WCA", "555wca", 60],
        ["SiGN", "555", 60]
    ]],
    ["6x6x6", [
        ["SiGN", "666si", 80],
        ["prefix", "666p", 80],
        ["suffix", "666s", 80]
    ]],
    ["7x7x7", [
        ["SiGN", "777si", 100],
        ["prefix", "777p", 100],
        ["suffix", "777s", 100]
    ]],
    ["Clock", [
        ["Jaap order", "clk", 0],
        ["concise", "clkc", 0],
        ["efficient pin order", "clke", 0]
    ]],
    ["Megaminx", [
        ["Pochmann", "mgmp", 70],
        ["old style", "mgmo", 70]
    ]],
    ["Pyraminx", [
        ["random state", "pyrso", 11],
        ["optimal random state", "pyro", 0],
        ["random moves", "pyrm", 25]
    ]],
    ["Square-1", [
        ["face turn metric", "sq1h", 40],
        ["twist metric", "sq1t", 20],
        ["random state", "sqrs", 0]
    ]],
    ["===OTHER PUZZLES===", [
        ["--", "blank", 0]
    ]],
    ["15 puzzle", [
        ["piece moves", "15p", 80],
        ["blank moves", "15pm", 80]
    ]],
    ["1x3x3 (Floppy Cube)", [
        ["U D L R", "flp", 25]
    ]],
    ["2x3x3 (Domino)", [
        [" ", "223", 25]
    ]],
    ["3x3x4", [
        [" ", "334", 40]
    ]],
    ["3x3x5", [
        ["shapeshifting", "335", 25]
    ]],
    ["3x3x6", [
        [" ", "336", 40]
    ]],
    ["3x3x7", [
        ["shapeshifting", "337", 40]
    ]],
    ["8x8x8", [
        ["SiGN", "888", 120]
    ]],
    ["9x9x9", [
        ["SiGN", "999", 120]
    ]],
    ["11x11x11", [
        ["SiGN", "111111", 120]
    ]],
    ["Cmetrick", [
        [" ", "cm3", 25]
    ]],
    ["Cmetrick Mini", [
        [" ", "cm2", 25]
    ]],
    ["Domino (2x3x3)", [
        [" ", "223", 25]
    ]],
    ["Floppy Cube (1x3x3)", [
        ["U D L R", "flp", 25]
    ]],
    ["FTO (Face-Turning Octahedron)", [
        [" ", "fto", 25]
    ]],
    ["Gigaminx", [
        ["Pochmann", "giga", 300]
    ]],
    ["Helicopter Cube", [
        [" ", "heli", 40]
    ]],
    ["Pyraminx Crystal", [
        ["Pochmann", "prcp", 70],
        ["old style", "prco", 70]
    ]],
    ["Siamese Cube (1x1x3 block)", [
        [" ", "sia113", 25]
    ]],
    ["Siamese Cube (1x2x3 block)", [
        [" ", "sia123", 25]
    ]],
    ["Siamese Cube (2x2x2 block)", [
        [" ", "sia222", 25]
    ]],
    ["Skewb", [
        ["U L R B", "skb", 25]
    ]],
    ["Square-2", [
        [" ", "sq2", 20]
    ]],
    ["Super Floppy Cube", [
        [" ", "sfl", 25]
    ]],
    ["Super Square-1", [
        ["twist metric", "ssq1t", 20]
    ]],
    ["UFO", [
        ["Jaap style", "ufo", 25]
    ]],
    ["===SPECIALTY SCRAMBLES===", [
        ["--", "blank", 0]
    ]],
    ["1x1x1", [
        ["x y z", "111", 25]
    ]],
    ["3x3x3 subsets", [
        ["2-generator <R,U>", "2gen", 25],
        ["2-generator <L,U>", "2genl", 25],
        ["Roux-generator <M,U>", "roux", 25],
        ["3-generator <F,R,U>", "3gen_F", 25],
        ["3-generator <R,U,L>", "3gen_L", 25],
        ["3-generator <R,r,U>", "RrU", 25],
        ["half turns only", "half", 25],
        ["edges only", "edges", 0],
        ["corners only", "corners", 0],
        ["last layer", "ll", 0],
        ["last slot + last layer", "lsll2", 0],
        ["last slot + last layer (old)", "lsll", 15]
    ]],
    ["Bandaged Cube (Bicube)", [
        ["", "bic", 30]
    ]],
    ["Bandaged Square-1 </,(1,0)>", [
        ["twist metric", "bsq", 25]
    ]],
    ["Bigcube subsets", [
        ["<R,r,U,u>", "RrUu", 40],
        ["4x4x4 edges", "4edge", 8],
        ["5x5x5 edges", "5edge", 8],
        ["6x6x6 edges", "6edge", 8],
        ["7x7x7 edges", "7edge", 8]
    ]],
    ["Megaminx subsets", [
        ["2-generator <R,U>", "minx2g", 30],
        ["last slot + last layer", "mlsll", 20]
    ]],
    ["Relays", [
        ["lots of 3x3x3s", "r3", 5],
        ["234 relay", "r234", 0],
        ["2345 relay", "r2345", 0],
        ["23456 relay", "r23456", 0],
        ["234567 relay", "r234567", 0]
    ]],
    ["===JOKE SCRAMBLES===", [
        ["--", "blank", 0]
    ]],
    ["-1x-1x-1 (micro style)", [
        [" ", "-1", 25]
    ]],
    ["1x1x2", [
        [" ", "112", 25]
    ]],
    ["3x3x3 for noobs", [
        [" ", "333noob", 25]
    ]],
    ["LOL", [
        [" ", "lol", 25]
    ]],
    ["Derrick Eide", [
        [" ", "eide", 25]
    ]]
];

// Takes a random element of the array x.
function rndEl(x) {
    return x[Math.floor(Math.random() * x.length)];
}

function scrambleIt() {
    for (var i = 0; i < num; i++) ss[i] = "";
    if (type == "111") {			// 1x1x1
        megascramble([
            ["x"],
            ["y"],
            ["z"]
        ], cubesuff);
    }
    else if (type == "2223") {			// 2x2x2 (3-gen)
        megascramble([
            ["U"],
            ["R"],
            ["F"]
        ], cubesuff);
    }
    else if (type == "2226") {			// 2x2x2 (6-gen)
        megascramble([
            [
                ["U", "D"]
            ],
            [
                ["R", "L"]
            ],
            [
                ["F", "B"]
            ]
        ], cubesuff);
    }
    else if (type == "222o") {			// 2x2x2 (optimal random state)
        get2x2optscramble(0);
    }
    else if (type == "222so") {		// 2x2x2 (random state)
        get2x2optscramble(9);
    }
    else if (type == "333o") {			// 3x3x3 (old style)
        megascramble([
            ["U", "D"],
            ["R", "L"],
            ["F", "B"]
        ], cubesuff);
    }
    else if (type == "333") {		        // 3x3x3 (random state)
        ss[0] = scramblers["333"].getRandomScramble();
    }
    else if (type == "sqrs") {	          	// square-1 (random state)
        if (initoncesq1 == 1) {
            scramblers['sq1'].initialize(null, Math);
            initoncesq1 = 0;
        }
        ss[0] = scramblers["sq1"].getRandomScramble().scramble;
    }
    else if (type == "334") {			// 3x3x4
        megascramble([
            [
                ["U", "U'", "U2", "u", "u'", "u2", "U u", "U u'", "U u2", "U' u", "U' u'", "U' u2", "U2 u", "U2 u'", "U2 u2"]
            ],
            [
                ["R2", "L2", "M2"]
            ],
            [
                ["F2", "B2", "S2"]
            ]
        ], [""]);
    }
    else if (type == "335") {			// 3x3x5
        var n;
        megascramble([
            [
                ["U", "U'", "U2"],
                ["D", "D'", "D2"]
            ],
            ["R2", "L2"],
            ["F2", "B2"]
        ], [""]);
        for (n = 0; n < num; n++) {
            ss[n] += " / ";
        }
        ss[0] += scramblers["333"].getRandomScramble();
    }
    else if (type == "336") {			// 3x3x6
        megascramble([
            [
                ["U", "U'", "U2", "u", "u'", "u2", "U u", "U u'", "U u2", "U' u", "U' u'", "U' u2", "U2 u", "U2 u'", "U2 u2", "3u", "3u'", "3u2", "U 3u", "U' 3u", "U2 3u", "u 3u", "u' 3u", "u2 3u", "U u 3u", "U u' 3u", "U u2 3u", "U' u 3u", "U' u' 3u", "U' u2 3u", "U2 u 3u", "U2 u' 3u", "U2 u2 3u", "U 3u'", "U' 3u'", "U2 3u'", "u 3u'", "u' 3u'", "u2 3u'", "U u 3u'", "U u' 3u'", "U u2 3u'", "U' u 3u'", "U' u' 3u'", "U' u2 3u'", "U2 u 3u'", "U2 u' 3u'", "U2 u2 3u'", "U 3u2", "U' 3u2", "U2 3u2", "u 3u2", "u' 3u2", "u2 3u2", "U u 3u2", "U u' 3u2", "U u2 3u2", "U' u 3u2", "U' u' 3u2", "U' u2 3u2", "U2 u 3u2", "U2 u' 3u2", "U2 u2 3u2"]
            ],
            [
                ["R2", "L2", "M2"]
            ],
            [
                ["F2", "B2", "S2"]
            ]
        ], [""]);
    }
    else if (type == "337") {			// 3x3x7
        var n;
        megascramble([
            [
                ["U", "U'", "U2", "u", "u'", "u2", "U u", "U u'", "U u2", "U' u", "U' u'", "U' u2", "U2 u", "U2 u'", "U2 u2"],
                ["D", "D'", "D2", "d", "d'", "d2", "D d", "D d'", "D d2", "D' d", "D' d'", "D' d2", "D2 d", "D2 d'", "D2 d2"]
            ],
            ["R2", "L2"],
            ["F2", "B2"]
        ], [""]);
        for (n = 0; n < num; n++) {
            ss[n] += " / ";
        }
        ss[0] += scramblers["333"].getRandomScramble();
    }
    else if (type == "888") {			// 8x8x8 (SiGN)
        megascramble([
            ["U", "D", "u", "d", "3u", "3d", "4u"],
            ["R", "L", "r", "l", "3r", "3l", "4r"],
            ["F", "B", "f", "b", "3f", "3b", "4f"]
        ], cubesuff);
    }
    else if (type == "999") {			// 9x9x9 (SiGN)
        megascramble([
            ["U", "D", "u", "d", "3u", "3d", "4u", "4d"],
            ["R", "L", "r", "l", "3r", "3l", "4r", "4l"],
            ["F", "B", "f", "b", "3f", "3b", "4f", "4b"]
        ], cubesuff);
    }
    else if (type == "111111") {		// 11x11x11 (SiGN)
        megascramble([
            ["U", "D", "u", "d", "3u", "3d", "4u", "4d", "5u", "5d"],
            ["R", "L", "r", "l", "3r", "3l", "4r", "4l", "5r", "5l"],
            ["F", "B", "f", "b", "3f", "3b", "4f", "4b", "5f", "5b"]
        ], cubesuff);
    }
    else if (type == "444") {			// 4x4x4 (SiGN)
        megascramble([
            ["U", "D", "u"],
            ["R", "L", "r"],
            ["F", "B", "f"]
        ], cubesuff);
    }
    else if (type == "444wca") {		// 4x4x4 (WCA)
        megascramble([
            ["U", "D", "Uw"],
            ["R", "L", "Rw"],
            ["F", "B", "Fw"]
        ], cubesuff);
    }
    else if (type == "444yj") {		// 4x4x4 (YJ style)
        yj4x4();
    }
    else if (type == "555") {			// 5x5x5 (SiGN)
        megascramble([
            ["U", "D", "u", "d"],
            ["R", "L", "r", "l"],
            ["F", "B", "f", "b"]
        ], cubesuff);
    }
    else if (type == "555wca") {		// 5x5x5 (WCA)
        megascramble([
            ["U", "D", "Uw", "Dw"],
            ["R", "L", "Rw", "Lw"],
            ["F", "B", "Fw", "Bw"]
        ], cubesuff);
    }
    else if (type == "666p") {			// 6x6x6 (prefix)
        megascramble([
            ["U", "D", "2U", "2D", "3U"],
            ["R", "L", "2R", "2L", "3R"],
            ["F", "B", "2F", "2B", "3F"]
        ], cubesuff);
    }
    else if (type == "666s") {			// 6x6x6 (suffix)
        megascramble([
            ["U", "D", "U&sup2;", "D&sup2;", "U&sup3;"],
            ["R", "L", "R&sup2;", "L&sup2;", "R&sup3;"],
            ["F", "B", "F&sup2;", "B&sup2;", "F&sup3;"]
        ], cubesuff);
    }
    else if (type == "666si") {		// 6x6x6 (SiGN)
        megascramble([
            ["U", "D", "u", "d", "3u"],
            ["R", "L", "r", "l", "3r"],
            ["F", "B", "f", "b", "3f"]
        ], cubesuff);
    }
    else if (type == "777p") {			// 7x7x7 (prefix)
        megascramble([
            ["U", "D", "2U", "2D", "3U", "3D"],
            ["R", "L", "2R", "2L", "3R", "3L"],
            ["F", "B", "2F", "2B", "3F", "3B"]
        ], cubesuff);
    }
    else if (type == "777s") {			// 7x7x7 (suffix)
        megascramble([
            ["U", "D", "U&sup2;", "D&sup2;", "U&sup3;", "D&sup3;"],
            ["R", "L", "R&sup2;", "L&sup2;", "R&sup3;", "L&sup3;"],
            ["F", "B", "F&sup2;", "B&sup2;", "F&sup3;", "B&sup3;"]
        ], cubesuff);
    }
    else if (type == "777si") {		// 7x7x7 (SiGN)
        megascramble([
            ["U", "D", "u", "d", "3u", "3d"],
            ["R", "L", "r", "l", "3r", "3l"],
            ["F", "B", "f", "b", "3f", "3b"]
        ], cubesuff);
    }
    else if (type == "15p") {			// 15 puzzle
        do15puzzle(false);
    }
    else if (type == "15pm") {			// 15 puzzle, mirrored
        do15puzzle(true);
    }
    else if (type == "clkс") {			// Clock (Jaap order)
        for (var n = 0; n < num; n++) {
            ss[n] = "<tt><b><br>&nbsp;UU" + c("u") + "dU" + c("u") + "dd" + c("u") + "Ud" + c("u") + "dU" + c("u") + "Ud" + c("u") + "UU" + c("u") + "UU";
            ss[n] += c("u") + "UU" + c("u") + "dd" + c3() + c2() + "<br>&nbsp;dd" + c("d") + "dU" + c("d") + "UU" + c("d") + "Ud" + c("d");
            ss[n] += "UU" + c3() + "UU" + c3() + "Ud" + c3() + "dU" + c3() + "UU" + c3() + "dd" + c("d") + c2() + "</b></tt><br>";
        }
    }
    else if (type == "clk") {			// Clock (concise)
        for (var n = 0; n < num; n++) {
            ss[n] = "";
            for (var i = 0; i < 4; i++) ss[n] += "(" + (Math.floor(Math.random() * 12) - 5) + ", " + (Math.floor(Math.random() * 12) - 5) + ") / ";
            for (var i = 0; i < 6; i++) ss[n] += "(" + (Math.floor(Math.random() * 12) - 5) + ") / ";
            for (var i = 0; i < 4; i++) ss[n] += rndEl(["d", "U"]);
        }
    }
    else if (type == "clke") {			// Clock (efficient order)
        for (var n = 0; n < num; n++) {
            ss[n] = "<tt><b><br>&nbsp;UU" + c("u") + "dU" + c("u") + "dU" + c("u") + "UU" + c("u") + "UU" + c("u") + "UU" + c("u") + "Ud" + c("u") + "Ud";
            ss[n] += c("u") + "dd" + c("u") + "dd" + c3() + c2() + "<br>&nbsp;UU" + c3() + "UU" + c3() + "dU" + c("d") + "dU" + c3() + "dd";
            ss[n] += c("d") + "Ud" + c3() + "Ud" + c("d") + "UU" + c3() + "UU" + c("d") + "dd" + c("d") + c2() + "</b></tt><br>";
        }
    }
    else if (type == "cm3") {			// Cmetrick
        megascramble([
            [
                ["U<", "U>", "U2"],
                ["E<", "E>", "E2"],
                ["D<", "D>", "D2"]
            ],
            [
                ["R^", "Rv", "R2"],
                ["M^", "Mv", "M2"],
                ["L^", "Lv", "L2"]
            ]
        ], [""]);
    }
    else if (type == "cm2") {			// Cmetrick Mini
        megascramble([
            [
                ["U<", "U>", "U2"],
                ["D<", "D>", "D2"]
            ],
            [
                ["R^", "Rv", "R2"],
                ["L^", "Lv", "L2"]
            ]
        ], [""]);
    }
    else if (type == "223") {			// Domino/2x3x3
        megascramble([
            [
                ["U", "U'", "U2"]
            ],
            [
                ["R2", "L2", "R2 L2"]
            ],
            [
                ["F2", "B2", "F2 B2"]
            ]
        ], [""]);
    }
    else if (type == "flp") {			// Floppy Cube
        megascramble([
            ["R", "L"],
            ["U", "D"]
        ], ["2"]);
    }
    else if (type == "fto") {			// FTO/Face-Turning Octa
        megascramble([
            ["U", "D"],
            ["F", "B"],
            ["L", "BR"],
            ["R", "BL"]
        ], ["", "'"]);
    }
    else if (type == "giga") {			// Gigaminx
        gigascramble();
    }
    else if (type == "heli") {			// Helicopter Cube
        helicubescramble();
    }
    else if (type == "mgmo") {			// Megaminx (old style)
        oldminxscramble();
    }
    else if (type == "mgmp") {			// Megaminx (Pochmann)
        pochscramble(10, Math.ceil(len / 10));
    }
    else if (type == "pyrm") {			// Pyraminx (random moves)
        megascramble([
            ["U"],
            ["L"],
            ["R"],
            ["B"]
        ], ["!", "'"]);
        for (var n = 0; n < num; n++) {
            var cnt = 0;
            var rnd = [];
            for (var i = 0; i < 4; i++) {
                rnd[i] = Math.floor(Math.random() * 3);
                if (rnd[i] > 0) cnt++;
            }
            ss[n] = ss[n].substr(0, ss[n].length - 3 * cnt);
            ss[n] = ["", "b ", "b' "][rnd[0]] + ["", "l ", "l' "][rnd[1]] + ["", "u ", "u' "][rnd[2]] + ["", "r ", "r' "][rnd[3]] + ss[n];
            ss[n] = ss[n].replace(/!/g, "");
        }
    }
    else if (type == "pyro") {			// Pyraminx (optimal random state)
        getpyraoptscramble(0);
    }
    else if (type == "pyrso") {		// Pyraminx (random state)
        getpyraoptscramble(8);
    }
    else if (type == "prco") {			// Pyraminx Crystal (old style)
        megascramble([
            ["F", "B"],
            ["U", "D"],
            ["L", "DBR"],
            ["R", "DBL"],
            ["BL", "DR"],
            ["BR", "DL"]
        ], minxsuff);
    }
    else if (type == "prcp") {			// Pyraminx Crystal (Pochmann)
        pochscramble(10, Math.ceil(len / 10));
    }
    else if (type == "r234") {			// 2x2x2 3x3x3 4x4x4 relay
        ss[0] = "<br> 2) ";
        get2x2optscramble(9);
        ss[0] += "<br> 3) ";
        ss[0] += scramblers["333"].getRandomScramble();
        ss[0] += "<br> 4) ";
        len = 40;
        megascramble([
            ["U", "D", "u"],
            ["R", "L", "r"],
            ["F", "B", "f"]
        ], cubesuff);
        ;
    }
    else if (type == "r2345") {		// 2x2x2 3x3x3 4x4x4 5x5x5 relay
        ss[0] = "<br> 2) ";
        get2x2optscramble(9);
        ss[0] += "<br> 3) ";
        ss[0] += scramblers["333"].getRandomScramble();
        ss[0] += "<br> 4) ";
        len = 40;
        megascramble([
            ["U", "D", "u"],
            ["R", "L", "r"],
            ["F", "B", "f"]
        ], cubesuff);
        ss[0] += "<br> 5) ";
        len = 60;
        megascramble([
            ["U", "D", "u", "d"],
            ["R", "L", "r", "l"],
            ["F", "B", "f", "b"]
        ], cubesuff);
    }
    else if (type == "r23456") {		// 2x2x2 3x3x3 4x4x4 5x5x5 relay
        ss[0] = "<br> 2) ";
        get2x2optscramble(9);
        ss[0] += "<br> 3) ";
        ss[0] += scramblers["333"].getRandomScramble();
        ss[0] += "<br> 4) ";
        len = 40;
        megascramble([
            ["U", "D", "u"],
            ["R", "L", "r"],
            ["F", "B", "f"]
        ], cubesuff);
        ss[0] += "<br> 5) ";
        len = 60;
        megascramble([
            ["U", "D", "u", "d"],
            ["R", "L", "r", "l"],
            ["F", "B", "f", "b"]
        ], cubesuff);
        ss[0] += "<br> 6) ";
        len = 80;
        megascramble([
            ["U", "D", "2U", "2D", "3U"],
            ["R", "L", "2R", "2L", "3R"],
            ["F", "B", "2F", "2B", "3F"]
        ], cubesuff);
    }
    else if (type == "r234567") {		// 2x2x2 3x3x3 4x4x4 5x5x5 relay
        ss[0] = "<br> 2) ";
        get2x2optscramble(9);
        ss[0] += "<br> 3) ";
        ss[0] += scramblers["333"].getRandomScramble();
        ss[0] += "<br> 4) ";
        len = 40;
        megascramble([
            ["U", "D", "u"],
            ["R", "L", "r"],
            ["F", "B", "f"]
        ], cubesuff);
        ss[0] += "<br> 5) ";
        len = 60;
        megascramble([
            ["U", "D", "u", "d"],
            ["R", "L", "r", "l"],
            ["F", "B", "f", "b"]
        ], cubesuff);
        ss[0] += "<br> 6) ";
        len = 80;
        megascramble([
            ["U", "D", "2U", "2D", "3U"],
            ["R", "L", "2R", "2L", "3R"],
            ["F", "B", "2F", "2B", "3F"]
        ], cubesuff);
        ss[0] += "<br> 7) ";
        len = 100;
        megascramble([
            ["U", "D", "2U", "2D", "3U", "3D"],
            ["R", "L", "2R", "2L", "3R", "3L"],
            ["F", "B", "2F", "2B", "3F", "3B"]
        ], cubesuff);
    }
    else if (type == "r3") {			// multiple 3x3x3 relay
        var ncubes = len;
        len = 25;
        for (var i = 0; i < ncubes; i++) {
            ss[0] += "<br>" + (i + 1) + ") ";
            ss[0] += scramblers["333"].getRandomScramble();
        }
        len = ncubes;
    }
    else if (type == "sia113") {		// Siamese Cube (1x1x3 block)
        var n, s = [];
        megascramble([
            ["U", "u"],
            ["R", "r"]
        ], cubesuff);
        for (n = 0; n < num; n++) {
            ss[n] += " z2 ";
        }
        megascramble([
            ["U", "u"],
            ["R", "r"]
        ], cubesuff);
    }
    else if (type == "sia123") {		// Siamese Cube (1x2x3 block)
        var n, s = [];
        megascramble([
            ["U"],
            ["R", "r"]
        ], cubesuff);
        for (n = 0; n < num; n++) {
            ss[n] += " z2 ";
        }
        megascramble([
            ["U"],
            ["R", "r"]
        ], cubesuff);
    }
    else if (type == "sia222") {		// Siamese Cube (2x2x2 block)
        var n, s = [];
        megascramble([
            ["U"],
            ["R"],
            ["F"]
        ], cubesuff);
        for (n = 0; n < num; n++) {
            ss[n] += " z2 y ";
        }
        megascramble([
            ["U"],
            ["R"],
            ["F"]
        ], cubesuff);
    }
    else if (type == "skb") {			// Skewb
        megascramble([
            ["R"],
            ["L"],
            ["B"],
            ["U"]
        ], ["", "'"]);
    }
    else if (type == "sq1h") {			// Square-1 (turn metric)
        sq1_scramble(1);
    }
    else if (type == "sq1t") {			// Square-1 (twist metric)
        sq1_scramble(0);
    }
    else if (type == "sq2") {			// Square-2
        var i;
        for (var n = 0; n < num; n++) {
            i = 0;
            while (i < len) {
                var rndu = Math.floor(Math.random() * 12) - 5;
                var rndd = Math.floor(Math.random() * 12) - 5;
                if (rndu != 0 || rndd != 0) {
                    i++;
                    ss[n] += "(" + rndu + "," + rndd + ") / ";
                }
            }
        }
    }
    else if (type == "sfl") {			// Super Floppy Cube
        megascramble([
            ["R", "L"],
            ["U", "D"]
        ], cubesuff);
    }
    else if (type == "ssq1t") {		// Super Square-1 (twist metric)
        ssq1t_scramble();
    }
    else if (type == "ufo") {			// UFO
        megascramble([
            ["A"],
            ["B"],
            ["C"],
            [
                ["U", "U'", "U2'", "U2", "U3"]
            ]
        ], [""]);
    }
    else if (type == "2gen") {			// 2-generator <R,U>
        megascramble([
            ["U"],
            ["R"]
        ], cubesuff);
    }
    else if (type == "2genl") {		// 2-generator <L,U>
        megascramble([
            ["U"],
            ["L"]
        ], cubesuff);
    }
    else if (type == "roux") {			// Roux-generator <M,U>
        megascramble([
            ["U"],
            ["M"]
        ], cubesuff);
    }
    else if (type == "3gen_F") {		// 3-generator <F,R,U>
        megascramble([
            ["U"],
            ["R"],
            ["F"]
        ], cubesuff);
    }
    else if (type == "3gen_L") {		// 3-generator <R,U,L>
        megascramble([
            ["U"],
            ["R", "L"]
        ], cubesuff);
    }
    else if (type == "RrU") {			// 3-generator <R,r,U>
        megascramble([
            ["U"],
            ["R", "r"]
        ], cubesuff);
    }
    else if (type == "RrUu") {			// <R,r,U,u>
        megascramble([
            ["U", "u"],
            ["R", "r"]
        ], cubesuff);
    }
    else if (type == "minx2g") {		// megaminx 2-gen
        megascramble([
            ["U"],
            ["R"]
        ], minxsuff);
    }
    else if (type == "mlsll") {		// megaminx LSLL
        megascramble([
            [
                ["R U R'", "R U2 R'", "R U' R'", "R U2' R'"]
            ],
            [
                ["F' U F", "F' U2 F", "F' U' F", "F' U2' F"]
            ],
            [
                ["U", "U2", "U'", "U2'"]
            ]
        ], [""]);
    }
    else if (type == "bic") {			// Bandaged Cube
        bicube();
    }
    else if (type == "bsq") {			// Bandaged Square-1 </,(1,0)>
        sq1_scramble(2);
    }
    else if (type == "half") {			// 3x3x3 half turns
        megascramble([
            ["U", "D"],
            ["R", "L"],
            ["F", "B"]
        ], ["2"]);
    }
    else if (type == "edges") {		// 3x3x3 edges only
        ss[0] = scramblers["333"].getEdgeScramble();
    }
    else if (type == "corners") {		// 3x3x3 corners only
        ss[0] = scramblers["333"].getCornerScramble();
    }
    else if (type == "ll") {			// 3x3x3 last layer
        ss[0] = scramblers["333"].getLLScramble();
    }
    else if (type == "lsll2") {		// 3x3x3 last slot + last layer
        ss[0] = scramblers["333"].getLSLLScramble();
    }
    else if (type == "lsll") {			// 3x3x3 last slot + last layer (old)
        megascramble([
            [
                ["R U R'", "R U2 R'", "R U' R'"]
            ],
            [
                ["F' U F", "F' U2 F", "F' U' F"]
            ],
            [
                ["U", "U2", "U'"]
            ]
        ], [""]);
    }
    else if (type == "4edge") {		// 4x4x4 edges
        edgescramble("r b2", ["b2 r'", "b2 U2 r U2 r U2 r U2 r"], ["u"]);
    }
    else if (type == "5edge") {		// 5x5x5 edges
        edgescramble("r R b B", ["B' b' R' r'", "B' b' R' U2 r U2 r U2 r U2 r"], ["u", "d"]);
    }
    else if (type == "6edge") {		// 6x6x6 edges
        edgescramble("3r r 3b b", ["3b' b' 3r' r'", "3b' b' 3r' U2 r U2 r U2 r U2 r", "3b' b' r' U2 3r U2 3r U2 3r U2 3r", "3b' b' r2 U2 3R U2 3R U2 3R U2 3R"], ["u", "3u", "d"]);
    }
    else if (type == "7edge") {		// 7x7x7 edges
        edgescramble("3r r 3b b", ["3b' b' 3r' r'", "3b' b' 3r' U2 r U2 r U2 r U2 r", "3b' b' r' U2 3r U2 3r U2 3r U2 3r", "3b' b' r2 U2 3R U2 3R U2 3R U2 3R"], ["u", "3u", "3d", "d"]);
    }
    else if (type == "-1") {			// -1x-1x-1 (micro style)
        for (var n = 0; n < num; n++) {
            for (var i = 0; i < len; i++) {
                ss[n] += String.fromCharCode(32 + Math.floor(Math.random() * 224));
            }
            ss[n] += "Error: subscript out of range";
        }
    }
    else if (type == "112") {			// 1x1x2
        megascramble([
            ["R"],
            ["R"]
        ], cubesuff);
    }
    else if (type == "333noob") {		// 3x3x3 for noobs
        megascramble([
            ["turn the top face", "turn the bottom face"],
            ["turn the right face", "turn the left face"],
            ["turn the front face", "turn the back face"]
        ], [" clockwise by 90 degrees,", " counterclockwise by 90 degrees,", " by 180 degrees,"]);
        for (var n = 0; n < num; n++) {
            ss[n] = ss[n].replace(/t/, "T");
            ss[n] = ss[n].substr(0, ss[n].length - 2) + ".";
        }
    }
    else if (type == "lol") {			// LOL
        megascramble([
            ["L"],
            ["O"]
        ], [""]);
        for (var n = 0; n < num; n++) {
            ss[n] = ss[n].replace(/ /g, "");
        }
    }
    else if (type == "eide") {			// Derrick Eide
        megascramble([
            ["OMG"],
            ["WOW"],
            ["WTF"],
            [
                ["WOO-HOO", "WOO-HOO", "MATYAS", "YES", "YES", "YAY", "YEEEEEEEEEEEES"]
            ],
            ["HAHA"],
            ["XD"],
            [":D"],
            ["LOL"]
        ], ["", "", "", "!!!"]);
    }
    scramble = ss[0];
}

// Clock functions.
function c(s) {
    var array = [s + "&nbsp;&nbsp;", s + "'&nbsp;", s + "2'", s + "3'", s + "4'", s + "5'", s + "6&nbsp;", s + "5&nbsp;", s + "4&nbsp;", s + "3&nbsp;", s + "2&nbsp;", "&nbsp;&nbsp;&nbsp;"];
    return " </b>" + rndEl(array) + "<b>&nbsp;&nbsp; ";
}
function c2() {
    return rndEl(["U", "d"]) + rndEl(["U", "d"]);
}
function c3() {
    return "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
}

function edgescramble(start, end, moves) {
    var u = 0, d = 0, movemis = [];
    var triggers = [
        ["R", "R'"],
        ["R'", "R"],
        ["L", "L'"],
        ["L'", "L"],
        ["F'", "F"],
        ["F", "F'"],
        ["B", "B'"],
        ["B'", "B"]
    ];
    var ud = ["U", "D"];
    ss[0] = start;
    // initialize move misalignments
    for (var i = 0; i < moves.length; i++) {
        movemis[i] = 0;
    }

    for (var i = 0; i < len; i++) {
        // apply random moves
        var done = false;
        while (!done) {
            var v = "";
            for (var j = 0; j < moves.length; j++) {
                var x = Math.floor(Math.random() * 4);
                movemis[j] += x;
                if (x != 0) {
                    done = true;
                    v += " " + moves[j] + cubesuff[x - 1];
                }
            }
        }
        ss[0] += v;

        // apply random trigger, update U/D
        var trigger = Math.floor(Math.random() * 8);
        var layer = Math.floor(Math.random() * 2);
        var turn = Math.floor(Math.random() * 3);
        ss[0] += " " + triggers[trigger][0] + " " + ud[layer] + cubesuff[turn] + " " + triggers[trigger][1];
        if (layer == 0) {
            u += turn + 1;
        }
        if (layer == 1) {
            d += turn + 1;
        }
    }

    // fix everything
    for (var i = 0; i < moves.length; i++) {
        var x = 4 - (movemis[i] % 4);
        if (x < 4) {
            ss[0] += " " + moves[i] + cubesuff[x - 1];
        }
    }
    u = 4 - (u % 4);
    d = 4 - (d % 4);
    if (u < 4) {
        ss[0] += " U" + cubesuff[u - 1];
    }
    if (d < 4) {
        ss[0] += " D" + cubesuff[d - 1];
    }
    ss[0] += " " + rndEl(end);
}

function do15puzzle(mirrored) {
    var moves = (mirrored ? ["U", "L", "R", "D"] : ["D", "R", "L", "U"]);
    var effect = [
        [0, -1],
        [1, 0],
        [-1, 0],
        [0, 1]
    ];
    var x = 0, y = 3, k, done, r, lastr = 5;
    ss[0] = "";
    for (k = 0; k < len; k++) {
        done = false;
        while (!done) {
            r = Math.floor(Math.random() * 4);
            if (x + effect[r][0] >= 0 && x + effect[r][0] <= 3 && y + effect[r][1] >= 0 && y + effect[r][1] <= 3 && r + lastr != 3) {
                done = true;
                x += effect[r][0];
                y += effect[r][1];
                ss[0] += moves[r] + " ";
                lastr = r;
            }
        }
    }
}

function pochscramble(x, y) {
    var i, j, n;
    for (n = 0; n < num; n++) {
        for (i = 0; i < y; i++) {
            ss[n] += "<br>&nbsp;&nbsp;";
            for (j = 0; j < x; j++) {
                ss[n] += (j % 2 == 0 ? "R" : "D") + rndEl(["++", "--"]) + " ";
            }
            ss[n] += "U" + rndEl(["'", " "]);
        }
    }
}

function gigascramble() {
    var i, j, n;
    for (n = 0; n < num; n++) {
        for (i = 0; i < Math.ceil(len / 10); i++) {
            ss[n] += "<br>&nbsp;&nbsp;";
            for (j = 0; j < 10; j++) {
                ss[n] += (j % 2 == 0 ? (Math.random() > 0.5 ? "R" : "r") : (Math.random() > 0.5 ? "D" : "d")) + rndEl(["+", "++", "-", "--"]) + " ";
            }
            ss[n] += "y" + rndEl(minxsuff);
        }
    }
}

function sq1_scramble(type) {
    seq = [];
    var i, k, n;
    sq1_getseq(num, type);
    for (n = 0; n < num; n++) {
        var s = "";
        for (i = 0; i < seq[n].length; i++) {
            k = seq[n][i];
            if (k[0] == 7) {
                s += "/";
            } else {
                s += " (" + k[0] + "," + k[1] + ") ";
            }
        }
        ss[n] += s;
    }
}

function ssq1t_scramble() {
    seq = [];
    var i, n;
    sq1_getseq(num * 2, 0);
    for (n = 0; n < num; n++) {
        var s = seq[2 * n], t = seq[2 * n + 1], u = "", k;
        if (s[0][0] == 7) s = [
            [0, 0]
        ].concat(s);
        if (t[0][0] == 7) t = [
            [0, 0]
        ].concat(t);
        for (i = 0; i < len; i++) {
            u += "(" + s[2 * i][0] + "," + t[2 * i][0] + "," + t[2 * i][1] + "," + s[2 * i][1] + ") / ";
        }
        ss[n] += u;
    }
}

function sq1_getseq(num, type) {
    for (var n = 0; n < num; n++) {
        p = [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0];
        seq[n] = [];
        var cnt = 0;
        while (cnt < len) {
            var x = Math.floor(Math.random() * 12) - 5;
            var y = (type == 2) ? 0 : Math.floor(Math.random() * 12) - 5;
            var size = (x == 0 ? 0 : 1) + (y == 0 ? 0 : 1);
            if ((cnt + size <= len || type != 1) && (size > 0 || cnt == 0)) {
                if (sq1_domove(x, y)) {
                    if (type == 1) cnt += size;
                    if (size > 0) seq[n][seq[n].length] = [x, y];
                    if (cnt < len || type != 1) {
                        cnt++;
                        seq[n][seq[n].length] = [7, 0];
                        sq1_domove(7, 0);
                    }
                }
            }
        }
    }
}

function sq1_domove(x, y) {
    var i, temp, px, py;
    if (x == 7) {
        for (i = 0; i < 6; i++) {
            temp = p[i + 6];
            p[i + 6] = p[i + 12];
            p[i + 12] = temp;
        }
        return true;
    } else {
        if (p[(17 - x) % 12] || p[(11 - x) % 12] || p[12 + (17 - y) % 12] || p[12 + (11 - y) % 12]) {
            return false;
        } else {
            // do the move itself
            px = p.slice(0, 12);
            py = p.slice(12, 24);
            for (i = 0; i < 12; i++) {
                p[i] = px[(12 + i - x) % 12];
                p[i + 12] = py[(12 + i - y) % 12];
            }
            return true;
        }
    }
}

function oldminxscramble() {
    var i, j, k;
    var faces = ["F", "B", "U", "D", "L", "DBR", "DL", "BR", "DR", "BL", "R", "DBL"];
    var used = [];
    // adjacency table
    var adj = ["001010101010", "000101010101", "100010010110", "010001101001", "101000100101", "010100011010", "100110001001", "011001000110", "100101100010", "011010010001", "101001011000", "010110100100"];
    // now generate the scramble(s)
    for (i = 0; i < num; i++) {
        var s = "";
        for (j = 0; j < 12; j++) {
            used[j] = 0;
        }
        for (j = 0; j < len; j++) {
            var done = false;
            do {
                var face = Math.floor(Math.random() * 12);
                if (used[face] == 0) {
                    s += faces[face] + rndEl(minxsuff) + " ";
                    for (k = 0; k < 12; k++) {
                        if (adj[face].charAt(k) == "1") {
                            used[k] = 0;
                        }
                    }
                    used[face] = 1;
                    done = true;
                }
            } while (!done);
        }
        ss[i] += s;
    }
}

function bicube() {
    function canMove(face) {
        var u = [], i, j, done, z = 0;
        for (i = 0; i < 9; i++) {
            done = 0;
            for (j = 0; j < u.length; j++) {
                if (u[j] == start[d[face][i]]) done = 1;
            }
            if (done == 0) {
                u[u.length] = start[d[face][i]];
                if (start[d[face][i]] == 0) z = 1;
            }
        }
        return (u.length == 5 && z == 1);
    }

    function doMove(face, amount) {
        for (var i = 0; i < amount; i++) {
            var t = start[d[face][0]];
            start[d[face][0]] = start[d[face][6]];
            start[d[face][6]] = start[d[face][4]];
            start[d[face][4]] = start[d[face][2]];
            start[d[face][2]] = t;
            t = start[d[face][7]];
            start[d[face][7]] = start[d[face][5]];
            start[d[face][5]] = start[d[face][3]];
            start[d[face][3]] = start[d[face][1]];
            start[d[face][1]] = t;
        }
    }

    var d = [
        [0, 1, 2, 5, 8, 7, 6, 3, 4],
        [6, 7, 8, 13, 20, 19, 18, 11, 12],
        [0, 3, 6, 11, 18, 17, 16, 9, 10],
        [8, 5, 2, 15, 22, 21, 20, 13, 14]
    ];
    var start = [1, 1, 2, 3, 3, 2, 4, 4, 0, 5, 6, 7, 8, 9, 10, 10, 5, 6, 7, 8, 9, 11, 11], move = "UFLR", s = "", arr = [], poss, done, i, j, x, y;
    while (arr.length < len) {
        poss = [1, 1, 1, 1];
        for (j = 0; j < 4; j++) {
            if (poss[j] == 1 && !canMove(j))
                poss[j] = 0;
        }
        done = 0;
        while (done == 0) {
            x = 0 | Math.random() * 4;
            if (poss[x] == 1) {
                y = (0 | Math.random() * 3) + 1;
                doMove(x, y);
                done = 1;
            }
        }
        arr[arr.length] = [x, y];
        if (arr.length >= 2) {
            if (arr[arr.length - 1][0] == arr[arr.length - 2][0]) {
                arr[arr.length - 2][1] = (arr[arr.length - 2][1] + arr[arr.length - 1][1]) % 4;
                arr = arr.slice(0, arr.length - 1);
            }
        }
        if (arr.length >= 1) {
            if (arr[arr.length - 1][1] == 0) {
                arr = arr.slice(0, arr.length - 1);
            }
        }
    }
    for (i = 0; i < len; i++) {
        s += move[arr[i][0]] + cubesuff[arr[i][1] - 1] + " ";
    }
    ss[0] += s;
}

function yj4x4() {
    // the idea is to keep the fixed center on U and do Rw or Lw, Fw or Bw, to not disturb it
    turns = [
        ["U", "D"],
        ["R", "L", "r"],
        ["F", "B", "f"]
    ];
    var donemoves = [];
    var lastaxis;
    var fpos = 0; // 0 = Ufr, 1 = Ufl, 2 = Ubl, 3 = Ubr
    var i = 0, j, k;
    var s = "";
    lastaxis = -1;
    for (j = 0; j < len; j++) {
        var done = 0;
        do {
            var first = Math.floor(Math.random() * turns.length);
            var second = Math.floor(Math.random() * turns[first].length);
            if (first != lastaxis || donemoves[second] == 0) {
                if (first == lastaxis) {
                    donemoves[second] = 1;
                    var rs = Math.floor(Math.random() * cubesuff.length);
                    if (first == 0 && second == 0) {
                        fpos = (fpos + 4 + rs) % 4;
                    }
                    if (first == 1 && second == 2) { // r or l
                        if (fpos == 0 || fpos == 3) s += "l" + cubesuff[rs] + " ";
                        else s += "r" + cubesuff[rs] + " ";
                    } else if (first == 2 && second == 2) { // f or b
                        if (fpos == 0 || fpos == 1) s += "b" + cubesuff[rs] + " ";
                        else s += "f" + cubesuff[rs] + " ";
                    } else {
                        s += turns[first][second] + cubesuff[rs] + " ";
                    }
                } else {
                    for (k = 0; k < turns[first].length; k++) {
                        donemoves[k] = 0;
                    }
                    lastaxis = first;
                    donemoves[second] = 1;
                    var rs = Math.floor(Math.random() * cubesuff.length);
                    if (first == 0 && second == 0) {
                        fpos = (fpos + 4 + rs) % 4;
                    }
                    if (first == 1 && second == 2) { // r or l
                        if (fpos == 0 || fpos == 3) s += "l" + cubesuff[rs] + " ";
                        else s += "r" + cubesuff[rs] + " ";
                    } else if (first == 2 && second == 2) { // f or b
                        if (fpos == 0 || fpos == 1) s += "b" + cubesuff[rs] + " ";
                        else s += "f" + cubesuff[rs] + " ";
                    } else {
                        s += turns[first][second] + cubesuff[rs] + " ";
                    }
                }
                done = 1;
            }
        } while (done == 0);
    }
    ss[i] += s;
}

function helicubescramble() {
    var i, j, k;
    var faces = ["UF", "UR", "UB", "UL", "FR", "BR", "BL", "FL", "DF", "DR", "DB", "DL"];
    var used = [];
    // adjacency table
    var adj = ["010110010000", "101011000000", "010101100000", "101000110000", "110000001100", "011000000110", "001100000011", "100100001001", "000010010101", "000011001010", "000001100101", "000000111010"];
    // now generate the scramble(s)
    for (i = 0; i < num; i++) {
        var s = "";
        for (j = 0; j < 12; j++) {
            used[j] = 0;
        }
        for (j = 0; j < len; j++) {
            var done = false;
            do {
                var face = Math.floor(Math.random() * 12);
                if (used[face] == 0) {
                    s += faces[face] + " ";
                    for (k = 0; k < 12; k++) {
                        if (adj[face].charAt(k) == "1") {
                            used[k] = 0;
                        }
                    }
                    used[face] = 1;
                    done = true;
                }
            } while (!done);
        }
        ss[i] += s;
    }
}

// Function written by Tom van der Zanden/Jaap Scherphuis and optimized/obfuscated/condensed by me
function get2x2optscramble(mn) {
    var e = [15, 16, 16, 21, 21, 15, 13, 9, 9, 17, 17, 13, 14, 20, 20, 4, 4, 14, 12, 5, 5, 8, 8, 12, 3, 23, 23, 18, 18, 3, 1, 19, 19, 11, 11, 1, 2, 6, 6, 22, 22, 2, 0, 10, 10, 7, 7, 0], d = [
        [],
        [],
        [],
        [],
        [],
        []
    ], v = [
        [0, 2, 3, 1, 23, 19, 10, 6, 22, 18, 11, 7],
        [4, 6, 7, 5, 12, 20, 2, 10, 14, 22, 0, 8],
        [8, 10, 11, 9, 12, 7, 1, 17, 13, 5, 0, 19],
        [12, 13, 15, 14, 8, 17, 21, 4, 9, 16, 20, 5],
        [16, 17, 19, 18, 15, 9, 1, 23, 13, 11, 3, 21],
        [20, 21, 23, 22, 14, 16, 3, 6, 15, 18, 2, 4]
    ], r = [], a = [], b = [], c = [], f = [], s = [];

    function t() {
        s = [1, 1, 1, 1, 2, 2, 2, 2, 5, 5, 5, 5, 4, 4, 4, 4, 3, 3, 3, 3, 0, 0, 0, 0]
    }

    t();
    function mx() {
        t();
        for (var i = 0; i < 500; i++)dm(Math.floor(Math.random() * 3 + 3) + 16 * Math.floor(Math.random() * 3))
    }

    function cj() {
        var i, j;
        for (i = 0; i < 6; i++)for (j = 0; j < 6; j++)d[i][j] = 0;
        for (i = 0; i < 48; i += 2)if (s[e[i]] <= 5 && s[e[i + 1]] <= 5)d[s[e[i]]][s[e[i + 1]]]++
    }

    function dm(m) {
        var j = 1 + (m >> 4), k = m & 15, i;
        while (j) {
            for (i = 0; i < v[k].length; i += 4)y(s, v[k][i], v[k][i + 3], v[k][i + 2], v[k][i + 1]);
            j--
        }
    }

    function sv() {
        cj();
        var h = [], w = [], i = 0, j, k, m;
        for (j = 0; j < 7; j++) {
            m = 0;
            for (k = i; k < i + 6; k += 2) {
                if (s[e[k]] == s[e[42]])m += 4;
                if (s[e[k]] == s[e[44]])m += 1;
                if (s[e[k]] == s[e[46]])m += 2
            }
            h[j] = m;
            if (s[e[i]] == s[e[42]] || s[e[i]] == 5 - s[e[42]])w[j] = 0; else if (s[e[i + 2]] == s[e[42]] || s[e[i + 2]] == 5 - s[e[42]])w[j] = 1; else w[j] = 2;
            i += 6
        }
        m = 0;
        for (i = 0; i < 7; i++) {
            j = 0;
            for (k = 0; k < 7; k++) {
                if (h[k] == i)break;
                if (h[k] > i)j++
            }
            m = m * (7 - i) + j
        }
        j = 0;
        for (i = 5; i >= 0; i--)j = j * 3 + w[i] - 3 * Math.floor(w[i] / 3);
        if (m != 0 || j != 0) {
            r.length = 0;
            for (k = mn; k < 99; k++)if (se(0, m, j, k, -1))break;
            j = "";
            for (m = 0; m < r.length; m++)j = "URF".charAt(r[m] / 10) + "\'2 ".charAt(r[m] % 10) + " " + j;
            return j
        }
    }

    function se(i, j, k, l, m) {
        if (l != 0) {
            if (a[j] > l || b[k] > l)return false;
            var o, p, q, n;
            for (n = 0; n < 3; n++)if (n != m) {
                o = j;
                p = k;
                for (q = 0; q < 3; q++) {
                    o = c[o][n];
                    p = f[p][n];
                    r[i] = 10 * n + q;
                    if (se(i + 1, o, p, l - 1, n))return true
                }
            }
        } else if (j == 0 && k == 0)return true;
        return false
    }

    function z() {
        var i, j, k, m, n;
        for (i = 0; i < 5040; i++) {
            a[i] = -1;
            c[i] = [];
            for (j = 0; j < 3; j++)c[i][j] = g(i, j)
        }
        a[0] = 0;
        for (i = 0; i <= 6; i++)for (j = 0; j < 5040; j++)if (a[j] == i)for (k = 0; k < 3; k++) {
            m = j;
            for (n = 0; n < 3; n++) {
                var m = c[m][k];
                if (a[m] == -1)a[m] = i + 1
            }
        }
        for (i = 0; i < 729; i++) {
            b[i] = -1;
            f[i] = [];
            for (j = 0; j < 3; j++)f[i][j] = w(i, j)
        }
        b[0] = 0;
        for (i = 0; i <= 5; i++)for (j = 0; j < 729; j++)if (b[j] == i)for (k = 0; k < 3; k++) {
            m = j;
            for (n = 0; n < 3; n++) {
                var m = f[m][k];
                if (b[m] == -1)b[m] = i + 1
            }
        }
    }

    function g(i, j) {
        var k, m, n, o = i, h = [];
        for (k = 1; k <= 7; k++) {
            m = o % k;
            o = (o - m) / k;
            for (n = k - 1; n >= m; n--)h[n + 1] = h[n];
            h[m] = 7 - k
        }
        if (j == 0)y(h, 0, 1, 3, 2); else if (j == 1)y(h, 0, 4, 5, 1); else if (j == 2)y(h, 0, 2, 6, 4);
        o = 0;
        for (k = 0; k < 7; k++) {
            m = 0;
            for (n = 0; n < 7; n++) {
                if (h[n] == k)break;
                if (h[n] > k)m++
            }
            o = o * (7 - k) + m
        }
        return o
    }

    function w(i, j) {
        var k, m, n, o = 0, p = i, h = [];
        for (k = 0; k <= 5; k++) {
            n = Math.floor(p / 3);
            m = p - 3 * n;
            p = n;
            h[k] = m;
            o -= m;
            if (o < 0)o += 3
        }
        h[6] = o;
        if (j == 0)y(h, 0, 1, 3, 2); else if (j == 1) {
            y(h, 0, 4, 5, 1);
            h[0] += 2;
            h[1]++;
            h[5] += 2;
            h[4]++
        } else if (j == 2) {
            y(h, 0, 2, 6, 4);
            h[2] += 2;
            h[0]++;
            h[4] += 2;
            h[6]++
        }
        p = 0;
        for (k = 5; k >= 0; k--)p = p * 3 + (h[k] % 3);
        return p
    }

    function y(i, j, k, m, n) {
        var o = i[j];
        i[j] = i[k];
        i[k] = i[m];
        i[m] = i[n];
        i[n] = o
    }

    z();
    for (var i = 0; i < num; i++) {
        mx();
        ss[i] += sv();
    }
}

// Function written by Lucas Garron/Jaap Scherphuis and optimized/obfuscated/condensed by me
function getpyraoptscramble(mn) {
    var j = 1, b = [], g = [], f = [], d = [], e = [], k = [], h = [], i = [];

    function u() {
        var c, p, q, l, m;
        for (p = 0; p < 720; p++) {
            g[p] = -1;
            d[p] = [];
            for (m = 0; m < 4; m++)d[p][m] = w(p, m)
        }
        g[0] = 0;
        for (l = 0; l <= 6; l++)for (p = 0; p < 720; p++)if (g[p] == l)for (m = 0; m < 4; m++) {
            q = p;
            for (c = 0; c < 2; c++) {
                q = d[q][m];
                if (g[q] == -1)g[q] = l + 1
            }
        }
        for (p = 0; p < 2592; p++) {
            f[p] = -1;
            e[p] = [];
            for (m = 0; m < 4; m++)e[p][m] = x(p, m)
        }
        f[0] = 0;
        for (l = 0; l <= 5; l++)for (p = 0; p < 2592; p++)if (f[p] == l)for (m = 0; m < 4; m++) {
            q = p;
            for (c = 0; c < 2; c++) {
                q = e[q][m];
                if (f[q] == -1)f[q] = l + 1
            }
        }
        for (c = 0; c < j; c++) {
            k = [];
            var t = 0, s = 0;
            q = 0;
            h = [0, 1, 2, 3, 4, 5];
            for (m = 0; m < 4; m++) {
                p = m + n(6 - m);
                l = h[m];
                h[m] = h[p];
                h[p] = l;
                if (m != p)s++
            }
            if (s % 2 == 1) {
                l = h[4];
                h[4] = h[5];
                h[5] = l
            }
            s = 0;
            i = [];
            for (m = 0; m < 5; m++) {
                i[m] = n(2);
                s += i[m]
            }
            i[5] = s % 2;
            for (m = 6; m < 10; m++) {
                i[m] = n(3)
            }
            for (m = 0; m < 6; m++) {
                l = 0;
                for (p = 0; p < 6; p++) {
                    if (h[p] == m)break;
                    if (h[p] > m)l++
                }
                q = q * (6 - m) + l
            }
            for (m = 9; m >= 6; m--)t = t * 3 + i[m];
            for (m = 4; m >= 0; m--)t = t * 2 + i[m];
            if (q != 0 || t != 0)for (m = mn; m < 99; m++)if (v(q, t, m, -1))break;
            b[c] = "";
            for (p = 0; p < k.length; p++)b[c] += ["U", "L", "R", "B"][k[p] & 7] + ["", "'"][(k[p] & 8) / 8] + " ";
            var a = ["l", "r", "b", "u"];
            for (p = 0; p < 4; p++) {
                q = n(3);
                if (q < 2)b[c] += a[p] + ["", "'"][q] + " "
            }
        }
    }

    function v(q, t, l, c) {
        if (l == 0) {
            if (q == 0 && t == 0)return true
        } else {
            if (g[q] > l || f[t] > l)return false;
            var p, s, a, m;
            for (m = 0; m < 4; m++)if (m != c) {
                p = q;
                s = t;
                for (a = 0; a < 2; a++) {
                    p = d[p][m];
                    s = e[s][m];
                    k[k.length] = m + 8 * a;
                    if (v(p, s, l - 1, m))return true;
                    k.length--
                }
            }
        }
        return false
    }

    function w(p, m) {
        var a, l, c, s = [], q = p;
        for (a = 1; a <= 6; a++) {
            c = Math.floor(q / a);
            l = q - a * c;
            q = c;
            for (c = a - 1; c >= l; c--)s[c + 1] = s[c];
            s[l] = 6 - a
        }
        if (m == 0)y(s, 0, 3, 1);
        if (m == 1)y(s, 1, 5, 2);
        if (m == 2)y(s, 0, 2, 4);
        if (m == 3)y(s, 3, 4, 5);
        q = 0;
        for (a = 0; a < 6; a++) {
            l = 0;
            for (c = 0; c < 6; c++) {
                if (s[c] == a)break;
                if (s[c] > a)l++
            }
            q = q * (6 - a) + l
        }
        return q
    }

    function x(p, m) {
        var a, l, c, t = 0, s = [], q = p;
        for (a = 0; a <= 4; a++) {
            s[a] = q & 1;
            q >>= 1;
            t ^= s[a]
        }
        s[5] = t;
        for (a = 6; a <= 9; a++) {
            c = Math.floor(q / 3);
            l = q - 3 * c;
            q = c;
            s[a] = l
        }
        if (m == 0) {
            s[6]++;
            if (s[6] == 3)s[6] = 0;
            y(s, 0, 3, 1);
            s[1] ^= 1;
            s[3] ^= 1
        }
        if (m == 1) {
            s[7]++;
            if (s[7] == 3)s[7] = 0;
            y(s, 1, 5, 2);
            s[2] ^= 1;
            s[5] ^= 1
        }
        if (m == 2) {
            s[8]++;
            if (s[8] == 3)s[8] = 0;
            y(s, 0, 2, 4);
            s[0] ^= 1;
            s[2] ^= 1
        }
        if (m == 3) {
            s[9]++;
            if (s[9] == 3)s[9] = 0;
            y(s, 3, 4, 5);
            s[3] ^= 1;
            s[4] ^= 1
        }
        q = 0;
        for (a = 9; a >= 6; a--)q = q * 3 + s[a];
        for (a = 4; a >= 0; a--)q = q * 2 + s[a];
        return q
    }

    function y(p, a, c, t) {
        var s = p[a];
        p[a] = p[c];
        p[c] = p[t];
        p[t] = s
    }

    function n(c) {
        return Math.floor(Math.random() * c)
    }

    u();
    ss[0] += b[0];
}

/* Function by Kas Thomas, http://www.planetpdf.com/developer/article.asp?ContentID=testing_for_object_types_in_ja */
function isArray(obj) {
    if (typeof obj == 'object') {
        var test = obj.constructor.toString().match(/array/i);
        return (test != null);
    }
    return false;
}

function megascramble(turns, suffixes) {
    var donemoves = [];
    var lastaxis;
    var i, j, k;
    for (i = 0; i < num; i++) {
        var s = "";
        lastaxis = -1;
        for (j = 0; j < len; j++) {
            var done = 0;
            do {
                var first = Math.floor(Math.random() * turns.length);
                var second = Math.floor(Math.random() * turns[first].length);
                if (first != lastaxis) {
                    for (k = 0; k < turns[first].length; k++) {
                        donemoves[k] = 0;
                    }
                    lastaxis = first;
                }
                if (donemoves[second] == 0) {
                    donemoves[second] = 1;
                    if (isArray(turns[first][second])) {
                        s += rndEl(turns[first][second]) + rndEl(suffixes) + " ";
                    } else {
                        s += turns[first][second] + rndEl(suffixes) + " ";
                    }
                    done = 1;
                }
            } while (done == 0);
        }
        ss[i] += s;
    }
}

// -->

scramblers['333'].initialize(null, Math); // hopefully this'll let IE load scramblers

var ident = [
    ["11", "2x2", "5", "1"],
    ["12", "3x3", "5", "2"],
    ["13", "4x4", "5", "3"],
    ["14", "5x5", "5", "4"],
    ["15", "6x6", "3", "5"],
    ["16", "7x7", "3", "6"],

    ["17", "3x3 одной рукой", "5", "2"],
    ["18", "3x3 ногами", "3", "2"],
    ["19", "3x3 вслепую", "3", "2"],
    ["20", "3x3 на количество ходов", "1", "2"],
    ["21", "3x3 крест вслепую", "5", "2"],

    ["22", "Пирамидка", "5", "9"],
    ["23", "Мегаминкс", "5", "8"],
    ["24", "Скваер", "5", "10"],
    ["25", "Часы Рубика", "5", "7"],

];


function getscramble() {
    box2 = [["random state", "333", 0], ["old style", "333o", 25]];
    len = box2[0][2];
    type = box2[0][1];
    scrambleIt();
    return scramble;
}