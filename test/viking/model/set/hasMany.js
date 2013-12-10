(function () {
    module("Viking.model#set - hasMany");

    // setting attributes on a model coerces relations
    test("#set(key, val) coerces hasMany relations", function() {
        Ship = Viking.Model.extend({ hasMany: ['ships'] });
        ShipCollection = Viking.Collection.extend({ model: Ship });

        var a = new Ship();
        a.set('ships', [{}, {}]);
        ok(a.get('ships') instanceof ShipCollection);
        equal(a.get('ships').length, 2);
        ok(a.get('ships').first() instanceof Ship);

        delete Ship;
        delete ShipCollection;
    });

    test("#set({key, val}) coerces hasMany relations", function() {
        Ship = Viking.Model.extend({ hasMany: ['ships'] });
        ShipCollection = Viking.Collection.extend({ model: Ship });

        var a = new Ship();
        a.set({ships: [{}, {}]});
        ok(a.get('ships') instanceof ShipCollection);
        equal(a.get('ships').length, 2);
        ok(a.get('ships').first() instanceof Ship);

        delete Ship;
        delete ShipCollection;
    });


    test("#set(belongsToRelation, data) updates the current collection and doesn't create a new one", function() {
        expect(6);

        Ship = Viking.Model.extend({ hasMany: ['ships'] });
        ShipCollection = Viking.Collection.extend({ model: Ship });

        var a = new Ship();
        a.set({ships: [{id: 1}, {}, {id: 3}]});
        a.get('ships').on("add", function() { ok(true); });
        a.get('ships').get(1).on("change", function() { ok(true); });
        a.get('ships').on("remove", function() { ok(true); });

        var oldCollection = a.get('ships');
        a.set({ships: [{id: 1, key: 'value'}, {id: 2}]});

        strictEqual(oldCollection, a.get('ships'));
        deepEqual([1, 2], a.get('ships').map(function(s) { return s.id; }));
        a.get('ships').off();
        a.get('ships').get(1).off();

        delete Ship;
        delete ShipCollection;
    })

}());
