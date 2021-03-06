'use strict';
(function () {
    var expect = chai.expect;
    describe('Service: np-page-metadata-control-binding', function () {
        var $q, npPageMetadataControlBinding, npPageMetadataHelperMock,
            addControlServiceMock, deleteControlServiceMock, npPageMetadataEventsMock, pageMetadataMock, npBindingHelperMock, npUICatalogMock;

        beforeEach(module('ngResource'));
        beforeEach(module('uiComposer.services'));

        beforeEach(function () {
            pageMetadataMock = {
                rootControlId: 'page',
                controls: [{
                    controlId: 'page',
                    catalogControlName: 'sap_m_Page',
                    catalogId: '556f6b0088fc39dfaead6099',
                    getChildrenMd: function () {
                        return this.groups[0].children;
                    },
                    groups: [
                        {groupId: 'content', children: [], binding: {}}
                    ]
                }]
            };
            npPageMetadataHelperMock = {
                getControlsAndChildMd: function (children, pageMd) {
                    return _.map(children, function (childId) {
                        return npPageMetadataHelperMock.getControlMd(childId, pageMd);
                    });
                },
                getControlAndChildMd: function (controlId, pageMd) {
                    return [npPageMetadataHelperMock.getControlMd(controlId, pageMd)];
                },
                canEditGroup: function () {
                    return true;
                },
                isBound: function (md) {
                    return !!md && !!md.binding && !!md.binding.entityId;
                },
                getControlMd: function (controlId, pageMd) {
                    return _.find(pageMd.controls, {
                        controlId: controlId
                    });
                },
                getGroupMd: function () {
                    return pageMetadataMock.controls[0].groups[0];
                },
                adjustChildIndexes: sinon.stub()
            };
            addControlServiceMock = {
                performAdd: function () {
                }
            };
            deleteControlServiceMock = {
                performDelete: function () {
                }
            };

            npPageMetadataEventsMock = {
                events: {
                    controlsBindingChanged: 'controlsBindingChanged'
                },
                broadcast: function () {
                }
            };
            npBindingHelperMock = {
                getPropertyPathsFromMd: function () {

                },
                getControlsToChange: sinon.stub()
            };
            npUICatalogMock = {
            };
            module(function ($provide) {
                $provide.value('npPageMetadataHelper', npPageMetadataHelperMock);
                $provide.value('npPageMetadataAddControl', addControlServiceMock);
                $provide.value('npPageMetadataDeleteControl', deleteControlServiceMock);
                $provide.value('npPageMetadataEvents', npPageMetadataEventsMock);
                $provide.value('npBindingHelper', npBindingHelperMock);
                $provide.value('npUiCatalog', npUICatalogMock);
            });

            inject(function ($injector) {
                npPageMetadataControlBinding = $injector.get('npPageMetadataControlBinding');
                $q = $injector.get('$q');
            });
        });

        it('Should fail if no updates', function () {
            var fnFail = function () {
                var bindingDef = {
                    controlId: 'page',
                    groupId: 'content'
                };
                npPageMetadataControlBinding.performChangeBindings([bindingDef], pageMetadataMock);
            };
            expect(fnFail).to.throw(Error);
        });

        it('Should bind page content and remove old children', function () {
            var template = {
                    controlId: 'button'
                },
                binding = {
                    entityId: 'entity'
                },
                bindingDef = {
                    controlId: 'page',
                    groupId: 'content',
                    binding: binding,
                    children: [template]
                },
                bindingDefs = [bindingDef],
                pageGroup = pageMetadataMock.controls[0].groups[0],
                addSpy = sinon.spy(addControlServiceMock, 'performAdd'),
                deleteSpy = sinon.spy(deleteControlServiceMock, 'performDelete'),
                eventSpy = sinon.spy(npPageMetadataEventsMock, 'broadcast');

            var oldChild = {
                controlId: 'label'
            };
            pageMetadataMock.controls.push(oldChild);
            pageGroup.children.push(oldChild.controlId);

            npPageMetadataControlBinding.performChangeBindings(bindingDefs, pageMetadataMock);
            expect(pageGroup.binding).to.be.deep.equal(binding);
            expect(addSpy.calledWith([template], pageMetadataMock)).to.be.ok;
            expect(deleteSpy.calledWith([oldChild], pageMetadataMock)).to.be.ok;
            expect(eventSpy.calledWith('controlsBindingChanged', pageMetadataMock)).to.be.ok;
            addControlServiceMock.performAdd.restore();
            deleteControlServiceMock.performDelete.restore();
            npPageMetadataEventsMock.broadcast.restore();
        });


        it('Should unbind page content', function () {

            var pageGroup = pageMetadataMock.controls[0].groups[0],
                binding = {
                    entityId: 'entity'
                };
            pageGroup.binding = binding;

            var bindingDef = {
                    controlId: 'page',
                    groupId: 'content'
                },
                addSpy = sinon.spy(addControlServiceMock, 'performAdd'),
                deleteSpy = sinon.spy(deleteControlServiceMock, 'performDelete');

            npPageMetadataControlBinding.performUnbindings([bindingDef], pageMetadataMock);
            expect(pageGroup.binding).to.be.deep.equal({});
            expect(addSpy.called).to.be.false;
            expect(deleteSpy.called).to.be.false;
            addControlServiceMock.performAdd.restore();
            deleteControlServiceMock.performDelete.restore();
        });
    });
})();
