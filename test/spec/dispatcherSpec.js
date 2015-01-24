import sinon from 'sinon';
import dispatcher from '../../src/index';

describe('BehaveDispatcher', () => {

    describe('.register(id, deps, callback)', () => {

        afterEach(() => { dispatcher.purge(); });

        it('should be defined', (done) => {
            expect(dispatcher.register).toBeDefined();
            done();
        });

        it('should register a callback that is called when dispatcher emits an event',
                (done) => {

            var spy1 = sinon.spy();
            var evt = {test: 'test'};

            dispatcher.register('Test', spy1);
            dispatcher.dispatch(evt);
            expect(spy1.called).toBe(true);
            done();
        });

        it('should allow you to register dependencies that are called before your callback',
                (done) => {

            var spy1 = sinon.spy();
            var spy2 = sinon.spy();
            var spy3 = sinon.spy();
            var evt = {test: 'test'};

            dispatcher.register('Test', ['Test2'], spy1);
            dispatcher.register('Test2', ['Test3'], spy2);
            dispatcher.register('Test3', spy3);
            dispatcher.dispatch(evt);

            expect(spy2.calledBefore(spy1)).toBe(true);
            expect(spy3.calledBefore(spy2)).toBe(true);
            expect(spy3.calledBefore(spy1)).toBe(true);
            done();
        });
    });

    describe('.unregister(id)', () => {

        afterEach(() => { dispatcher.purge(); });

        it('should be defined', (done) => {
            expect(dispatcher.unregister).toBeDefined();
            done();
        });

        it('should remove the specified callback from the dispatcher\'s registry',
                (done) => {

            var spy1 = sinon.spy();
            var evt = {test: 'test'};

            dispatcher.register('Test', spy1);
            dispatcher.unregister('Test');
            dispatcher.dispatch(evt);
            expect(spy1.called).toBe(false);
            done();
        });
    });

    describe('.purge()', () => {

        afterEach(() => { dispatcher.purge(); });

        it('should be defined', (done) => {
            expect(dispatcher.purge).toBeDefined();
            done();
        });

        it('should remove all callbacks from the dispatcher\'s registry',
                (done) => {

            var spy1 = sinon.spy();
            var spy2 = sinon.spy();
            var spy3 = sinon.spy();
            var evt = {test: 'test'};

            dispatcher.register('Test', ['Test2'], spy1);
            dispatcher.register('Test2', ['Test3'], spy2);
            dispatcher.register('Test3', spy3);

            dispatcher.purge();
            dispatcher.dispatch(evt);

            expect(spy1.called).toBe(false);
            expect(spy2.called).toBe(false);
            expect(spy3.called).toBe(false);
            done();
        });
    });

    describe('.dispatch(evt)', () => {

        afterEach(() => { dispatcher.purge(); });

        it('should be defined', (done) => {
            expect(dispatcher.dispatch).toBeDefined();
            done();
        });

        it('should kick off the invoking of all registered callbacks',
                (done) => {

            var spy1 = sinon.spy();
            var evt = {test: 'test'};

            dispatcher.register('Test', spy1);
            expect(spy1.called).toBe(false);
            dispatcher.dispatch(evt);
            expect(spy1.calledWith(evt)).toBe(true);
            done();
        });
    });

    describe('._invokeCallback(id)', () => {

        afterEach(() => { dispatcher.purge(); });

        it('should be defined', (done) => {
            expect(dispatcher._invokeCallback).toBeDefined();
            done();
        });

        it('should call callback at `id` after resolving any dependencies',
                (done) => {

            var spy1 = sinon.spy();
            var spy2 = sinon.spy();
            var evt = {test: 'test'};

            dispatcher.register('Test', ['Test2'], spy1);
            dispatcher.register('Test2', spy2);
            dispatcher._pendingPayload = evt;
            dispatcher._invokeCallback('Test');

            expect(spy2.calledBefore(spy1)).toBe(true);
            expect(spy2.calledWith(evt)).toBe(true);
            expect(spy1.calledWith(evt)).toBe(true);
            done();
        });
    });

    describe('._waitFor(ids)', () => {

        afterEach(() => { dispatcher.purge(); });

        it('should be defined', (done) => {
            expect(dispatcher._waitFor).toBeDefined();
            done();
        });

        it('should call callbacks in `ids` array',
                (done) => {

            var spy1 = sinon.spy();
            var spy2 = sinon.spy();
            var spy3 = sinon.spy();
            var evt = {test: 'test'};

            dispatcher.register('Test', spy1);
            dispatcher.register('Test2', spy2);
            dispatcher.register('Test3', spy3);
            dispatcher._pendingPayload = evt;
            dispatcher._waitFor(['Test', 'Test2']);

            expect(spy1.called).toBe(true);
            expect(spy2.called).toBe(true);
            expect(spy3.called).toBe(false);
            done();
        });
    });

    describe('._startDispatching(payload)', () => {

        afterEach(() => { dispatcher.purge(); });

        it('should be defined', (done) => {
            expect(dispatcher._startDispatching).toBeDefined();
            done();
        });

        it('should set `_pendingPayload` to passed in payload',
                (done) => {

            var evt = {test: 'test'};

            dispatcher._startDispatching(evt);
            expect(dispatcher._pendingPayload).toEqual(evt);
            done();
        });

        it('should set `_isDispatching` to true',
                (done) => {

            var evt = {test: 'test'};

            dispatcher._startDispatching(evt);
            expect(dispatcher._isDispatching).toEqual(true);
            done();
        });
    });

    describe('._stopDispatching(payload)', () => {

        afterEach(() => { dispatcher.purge(); });

        it('should be defined', (done) => {
            expect(dispatcher._stopDispatching).toBeDefined();
            done();
        });

        it('should set `_pendingPayload` to null',
                (done) => {

            var evt = {test: 'test'};

            dispatcher._pendingPayload = evt;

            dispatcher._stopDispatching();
            expect(dispatcher._pendingPayload).toEqual(null);
            done();
        });

        it('should set `_isDispatching` to false',
                (done) => {

            var evt = {test: 'test'};

            dispatcher._isDispatching = true;

            dispatcher._stopDispatching(evt);
            expect(dispatcher._isDispatching).toEqual(false);
            done();
        });
    });
});
